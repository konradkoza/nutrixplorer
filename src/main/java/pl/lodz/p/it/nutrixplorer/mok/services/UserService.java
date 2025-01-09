package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.HtmlEmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.EmailVerificationToken;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;
import pl.lodz.p.it.nutrixplorer.utils.ETagSigner;
import pl.lodz.p.it.nutrixplorer.utils.PasswordHolder;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
@LoggingInterceptor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final VerificationTokenService verificationTokenService;
    private final ETagSigner verifier;

    @Value("${nutrixplorer.frontend-url}")
    private String appUrl;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getCurrentUser() throws NotFoundException {
        String currentUser = SecurityContextUtil.getCurrentUser();
        return userRepository.findById(UUID.fromString(currentUser)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
    }

    public void blockUser(UUID id) throws NotFoundException, BlockUserException {
        String currentUser = SecurityContextUtil.getCurrentUser();
        if (currentUser.equals(id.toString())) {
            throw new BlockUserException(MokExceptionMessages.CANNOT_BLOCK_YOURSELF, MokErrorCodes.CANNOT_BLOCK_YOURSELF);
        }
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (user.isBlocked()) {
            throw new BlockUserException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
        }

        user.setBlocked(true);
        userRepository.save(user);
        eventPublisher.publishEvent(new HtmlEmailEvent(
                this,
                user.getEmail(),
                Map.of( "name",user.getFirstName() + " " + user.getLastName()),
                "accountBlocked",
                user.getLanguage()
        ));
    }

    public void unblockUser(UUID id) throws NotFoundException, BlockUserException {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (!user.isBlocked()) {
            throw new BlockUserException(MokExceptionMessages.USER_UNBLOCKED, MokErrorCodes.USER_UNBLOCKED);
        }
        user.setBlocked(false);
        userRepository.save(user);
        eventPublisher.publishEvent(new HtmlEmailEvent(
                this,
                user.getEmail(),
                Map.of( "name",user.getFirstName() + " " + user.getLastName()),
                "accountUnlocked",
                user.getLanguage()
        ));
    }


    public User findById(UUID id) throws NotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class}, isolation = Isolation.READ_COMMITTED)
    public void changeOwnPassword(PasswordHolder newPassword, PasswordHolder oldPassword) throws NotFoundException, AuthenctiactionFailedException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (passwordEncoder.matches(oldPassword.getPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword.getPassword()));
            userRepository.saveAndFlush(user);
        } else {
            throw new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, EmailAddressInUseException.class}, isolation = Isolation.READ_COMMITTED)
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

        String url = appUrl + "/verify/email?token=" + token;
        eventPublisher.publishEvent(new HtmlEmailEvent(
                this,
                email,
                Map.of("url", url,
                        "name",user.getFirstName() + " " + user.getLastName()),
                "emailChange",
                user.getLanguage()
        ));
    }

    public void changeEmailInit(String email, UUID id) throws EmailAddressInUseException, NotFoundException, TokenGenerationException {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (user.getEmail().equals(email)) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        String token = verificationTokenService.generateEmailVerificationToken(user, email);

        String url = appUrl + "/verify/email?token=" + token;
        eventPublisher.publishEvent(new HtmlEmailEvent(
                this,
                email,
                Map.of("url", url,
                        "name",user.getFirstName() + " " + user.getLastName()),
                "emailChange",
                user.getLanguage()
        ));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, EmailAddressInUseException.class}, isolation = Isolation.READ_COMMITTED)
    public void changeOwnEmailFinish(String token) throws VerificationTokenExpiredException, VerificationTokenInvalidException, EmailAddressInUseException {
        EmailVerificationToken verificationToken = (EmailVerificationToken) verificationTokenService.validateEmailVerificationToken(token);
        User user = verificationToken.getUser();
        user.setEmail(verificationToken.getNewEmail());
        try {
            user = userRepository.saveAndFlush(user);
        } catch (Exception e) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
    }

    public void changeOwnNameAndLastName(String firstName, String lastName, String tagValue) throws NotFoundException, InvalidHeaderException, ApplicationOptimisticLockException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if(!verifier.verifySignature(user.getId(), user.getVersion(), tagValue)){
            throw new ApplicationOptimisticLockException(ExceptionMessages.OPTIMISTIC_LOCK, ErrorCodes.OPTIMISTIC_LOCK);
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.saveAndFlush(user);
    }

    public void changeOwnLanguage(String language) throws NotFoundException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        user.setLanguage(language);
        userRepository.saveAndFlush(user);
    }

    public Page<User> findAllUsers(int page, int elements, Specification<User> specification) {
        return userRepository.findAll(specification, PageRequest.of(page, elements));
    }

    public void changeNameAndLastName(UUID id, String firstName, String lastName, String tagValue) throws NotFoundException, InvalidHeaderException, ApplicationOptimisticLockException {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));

        if(!verifier.verifySignature(user.getId(), user.getVersion(), tagValue)){
            throw new ApplicationOptimisticLockException(ExceptionMessages.OPTIMISTIC_LOCK, ErrorCodes.OPTIMISTIC_LOCK);
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.saveAndFlush(user);
    }

    public void changeUserPassword(UUID id) throws UserNotVerifiedException, UserBlockedException, OauthUserException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()){

            User user = userOptional.get();
            if (!user.isVerified()) {
                throw new UserNotVerifiedException(MokExceptionMessages.UNVERIFIED_ACCOUNT, MokErrorCodes.ACCOUNT_BLOCKED);
            }
            if (user.isBlocked()) {
                throw new UserBlockedException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
            }
            if (user.getPassword() == null) {
                throw new OauthUserException(MokExceptionMessages.OAUTH2_USER_PASSWORD, MokErrorCodes.OAUTH2_USER_PASSWORD);
            }
            String token = null;
            try {
                token = verificationTokenService.generatePasswordVerificationToken(user);
            } catch (TokenGenerationException e) {
                log.error("Token generation error", e);
            }
            if (token != null) {
                String url = appUrl + "/verify/forgot-password?token=" + token;
                eventPublisher.publishEvent(new HtmlEmailEvent(
                        this,
                        user.getEmail(),
                        Map.of("url", url,
                                "name",user.getFirstName() + " " + user.getLastName()),
                        "passwordChange",
                        user.getLanguage()
                ));
            }
        }

    }
}
