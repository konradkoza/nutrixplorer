package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.EmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.EmailVerificationToken;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
@LoggingInterceptor
public class UserService {
    private final AdministratorRepository administratorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final VerificationTokenService verificationTokenService;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getCurrentUser() throws NotFoundException {
        String currentUser = SecurityContextUtil.getCurrentUser();
        return userRepository.findById(UUID.fromString(currentUser)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
    }

    public void blockUser(UUID id) throws NotFoundException, BlockUserException {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (user.isBlocked()) {
            throw new BlockUserException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
        }

        user.setBlocked(true);
        userRepository.save(user);
    }

    public void unblockUser(UUID id) throws NotFoundException, BlockUserException {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (!user.isBlocked()) {
            throw new BlockUserException(MokExceptionMessages.USER_UNBLOCKED, MokErrorCodes.USER_UNBLOCKED);
        }
        user.setBlocked(false);
        userRepository.save(user);
    }

    public void verifyUser(UUID id) throws UserVerificationException, NotFoundException {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (user.isVerified()) {
            throw new UserVerificationException(MokExceptionMessages.USER_VERIFIED, MokErrorCodes.USER_VERIFIED);
        }
        user.setVerified(true);
        userRepository.save(user);
    }


    public User findById(UUID id) throws NotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class})
    public void changeOwnPassword(String newPassword, String oldPassword) throws NotFoundException, AuthenctiactionFailedException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.saveAndFlush(user);
        } else {
            throw new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, EmailAddressInUseException.class})
    public void changeOwnEmailInit(String email) throws EmailAddressInUseException, NotFoundException, TokenGenerationException {
        String id = SecurityContextUtil.getCurrentUser();
        if (userRepository.existsByEmail(email)) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (user.getEmail().equals(email)) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        String token = verificationTokenService.generateEmailVerificationToken(user, email);

        String url = "http://localhost:3000/verify/email?token=" + token;
        eventPublisher.publishEvent(new EmailEvent(this, email, "Email change", "Click the link to change your email: \n" + url));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, EmailAddressInUseException.class})
    public void changeOwnEmailFinish(String token) throws VerificationTokenExpiredException, VerificationTokenInvalidException, EmailAddressInUseException {
        EmailVerificationToken verificationToken = (EmailVerificationToken) verificationTokenService.validateEmailVerificationToken(token);
        User user = verificationToken.getUser();
        user.setEmail(verificationToken.getNewEmail());
        try {
            user = userRepository.saveAndFlush(user);
        } catch (Exception e) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        eventPublisher.publishEvent(new EmailEvent(this, user.getEmail(), "Email change", "Your email has been changed"));
    }

    public void changeOwnNameAndLastName(String firstName, String lastName) throws NotFoundException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.saveAndFlush(user);
    }
}
