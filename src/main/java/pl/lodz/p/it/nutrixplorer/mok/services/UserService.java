package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.mail.HtmlEmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.EmailVerificationToken;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.dto.*;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;
import pl.lodz.p.it.nutrixplorer.utils.ETagSigner;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;
import pl.lodz.p.it.nutrixplorer.utils.UserSpecificationUtil;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED, rollbackFor = BaseWebException.class, transactionManager = "mokTransactionManager")
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

    @PreAuthorize("isAuthenticated()")
    public User getCurrentUser() throws NotFoundException {
        String currentUser = SecurityContextUtil.getCurrentUser();
        return userRepository.findById(UUID.fromString(currentUser)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
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

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void unblockUser(UUID id) throws NotFoundException, BlockUserException {
        String currentUser = SecurityContextUtil.getCurrentUser();
        if (currentUser.equals(id.toString())) {
            throw new BlockUserException(MokExceptionMessages.CANNOT_UNLOCK_YOURSELF, MokErrorCodes.CANNOT_UNLOCK_YOURSELF);
        }
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

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public User findById(UUID id) throws NotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
    }

    @PreAuthorize("isAuthenticated()")
    public void changeOwnPassword(ChangePasswordDTO changePasswordDTO) throws NotFoundException, AuthenctiactionFailedException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (passwordEncoder.matches(changePasswordDTO.oldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(changePasswordDTO.newPassword()));
            userRepository.saveAndFlush(user);
        } else {
            throw new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS);
        }
    }

    @PreAuthorize("isAuthenticated()")
    public void changeOwnEmailInit(ChangeEmailDTO changeEmailDTO) throws EmailAddressInUseException, NotFoundException, TokenGenerationException {
        String id = SecurityContextUtil.getCurrentUser();
        if (userRepository.existsByEmail(changeEmailDTO.newEmail())) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (user.getEmail().equals(changeEmailDTO.newEmail())) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        String token = verificationTokenService.generateEmailVerificationToken(user, changeEmailDTO.newEmail()).getToken();

        String url = appUrl + "/verify/email?token=" + token;
        eventPublisher.publishEvent(new HtmlEmailEvent(
                this,
                changeEmailDTO.newEmail(),
                Map.of("url", url,
                        "name",user.getFirstName() + " " + user.getLastName()),
                "emailChange",
                user.getLanguage()
        ));
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void changeEmailInit(ChangeEmailDTO changeEmailDTO, UUID id) throws EmailAddressInUseException, NotFoundException, TokenGenerationException {
        if (userRepository.existsByEmail(changeEmailDTO.newEmail())) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if (user.getEmail().equals(changeEmailDTO.newEmail())) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
        String token = verificationTokenService.generateEmailVerificationToken(user, changeEmailDTO.newEmail()).getToken();

        String url = appUrl + "/verify/email?token=" + token;
        eventPublisher.publishEvent(new HtmlEmailEvent(
                this,
                changeEmailDTO.newEmail(),
                Map.of("url", url,
                        "name",user.getFirstName() + " " + user.getLastName()),
                "emailChange",
                user.getLanguage()
        ));
    }

    @PreAuthorize("permitAll()")
    public void changeOwnEmailFinish(ConfirmEmailChangeDTO confirmEmailChangeDTO) throws VerificationTokenExpiredException, VerificationTokenInvalidException, EmailAddressInUseException {
        EmailVerificationToken verificationToken = (EmailVerificationToken) verificationTokenService.validateEmailVerificationToken(confirmEmailChangeDTO.token());
        User user = verificationToken.getUser();
        user.setEmail(verificationToken.getNewEmail());
        try {
            userRepository.saveAndFlush(user);
        } catch (JpaSystemException e) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
    }

    @PreAuthorize("isAuthenticated()")
    public void changeOwnNameAndLastName(UserDTO userDTO, String tagValue) throws NotFoundException, InvalidHeaderException, ApplicationOptimisticLockException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        if(!verifier.verifySignature(user.getId(), user.getVersion(), tagValue)){
            throw new ApplicationOptimisticLockException(ExceptionMessages.OPTIMISTIC_LOCK, ErrorCodes.OPTIMISTIC_LOCK);
        }

        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());
        userRepository.saveAndFlush(user);
    }

    @PreAuthorize("isAuthenticated()")
    public void changeOwnLanguage(LanguageDTO languageDTO) throws NotFoundException {
        String id = SecurityContextUtil.getCurrentUser();
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        user.setLanguage(languageDTO.language());
        userRepository.saveAndFlush(user);
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public Page<User> findAllUsers(int page, int elements, UsersFilteringDTO filteringDTO) {
        Specification<User> specification = UserSpecificationUtil.createSpecification(filteringDTO);
        return userRepository.findAll(specification, PageRequest.of(page, elements));
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void changeNameAndLastName(UUID id, UserDTO userDTO, String tagValue) throws NotFoundException, InvalidHeaderException, ApplicationOptimisticLockException {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));

        if(!verifier.verifySignature(user.getId(), user.getVersion(), tagValue)){
            throw new ApplicationOptimisticLockException(ExceptionMessages.OPTIMISTIC_LOCK, ErrorCodes.OPTIMISTIC_LOCK);
        }

        user.setFirstName(userDTO.firstName());
        user.setLastName(userDTO.lastName());
        userRepository.saveAndFlush(user);
    }

}
