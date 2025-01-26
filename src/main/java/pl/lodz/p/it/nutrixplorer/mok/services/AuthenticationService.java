package pl.lodz.p.it.nutrixplorer.mok.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.HtmlEmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.model.mok.VerificationToken;
import pl.lodz.p.it.nutrixplorer.mok.dto.*;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(
        propagation = Propagation.REQUIRES_NEW,
        isolation = Isolation.READ_COMMITTED,
        transactionManager = "mokTransactionManager", rollbackFor = {BaseWebException.class})
@LoggingInterceptor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClientRepository clientRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final VerificationTokenService verificationTokenService;
    private final UserRolesService userRolesService;
    @Value("${nutrixplorer.login.max-attempts:3}")
    private int maxLoginAttempts;

    @Value("${nutrixplorer.login.lock-duration:300}")
    private int loginTimeOut;

    @Value("${nutrixplorer.frontend-url}")
    private String appUrl;

    public String login(AuthenticationDTO authenticationDTO, String remoteAddr) throws NotFoundException, AuthenctiactionFailedException, UserBlockedException, UserNotVerifiedException, LoginAttemptsExceededException {
        User user = userRepository.findByEmail(authenticationDTO.email()).orElseThrow(() -> new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS));

        if (user.getLoginAttempts() >= maxLoginAttempts && Duration.between(user.getLastFailedLogin(), LocalDateTime.now()).toSeconds() <= loginTimeOut) {
            throw new LoginAttemptsExceededException(MokExceptionMessages.SIGN_IN_BLOCKED, MokErrorCodes.SIGN_IN_BLOCKED);
        } else if (user.getLoginAttempts() >= maxLoginAttempts) {
            user.setLoginAttempts(0);
        }

        if (user.getPassword() == null) {
            throw new AuthenctiactionFailedException(MokExceptionMessages.OAUTH2_USER, MokErrorCodes.OAUTH2_USER);
        }
        if (passwordEncoder.matches(authenticationDTO.password(), user.getPassword())) {
            if (!user.isVerified()) {
                throw new UserNotVerifiedException(MokExceptionMessages.UNVERIFIED_ACCOUNT, MokErrorCodes.UNVERIFIED_ACCOUNT);
            }
            if (user.isBlocked()) {
                throw new UserBlockedException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
            }
            user.setLastSuccessfulLogin(LocalDateTime.now());
            user.setLoginAttempts(0);
            user.setLastSuccessfulLoginIp(remoteAddr);
            user.setLanguage(authenticationDTO.language());
            userRepository.saveAndFlush(user);
            log.info("Session started for user with id: {}, from address IP: {}", user.getId(), remoteAddr);
            return jwtService.generateToken(user.getId(), userRolesService.getUserRoles(user.getId())).getTokenValue();
        } else {
            user.setLastFailedLogin(LocalDateTime.now());
            user.setLastFailedLoginIp(remoteAddr);
            user.setLoginAttempts(user.getLoginAttempts() + 1);
            userRepository.saveAndFlush(user);

            if (user.getLoginAttempts() >= maxLoginAttempts) {

                String unblockDate = LocalDateTime.now().plusSeconds(loginTimeOut).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                String lastFailedLogin = user.getLastFailedLogin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                eventPublisher.publishEvent(new HtmlEmailEvent(
                        this,
                        user.getEmail(),
                        Map.of(
                                "loginNumber", user.getLoginAttempts(),
                                "failedLoginTime", lastFailedLogin,
                                "unblockTime", unblockDate,
                                "ip", user.getLastFailedLoginIp()
                        ),
                        "loginBlock",
                        user.getLanguage()
                ));
            }
            throw new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS);
        }
    }

    public User registerClient(RegisterClientDTO registerClientDTO) throws EmailAddressInUseException, UserRegisteringException {

        User user = new User();
        user.setEmail(registerClientDTO.email());
        user.setPassword(passwordEncoder.encode(registerClientDTO.password()));
        user.setFirstName(registerClientDTO.firstName());
        user.setLastName(registerClientDTO.lastName());
        user.setVerified(false);
        user.setBlocked(false);
        user.setLanguage(registerClientDTO.language());
        Client client = new Client();
        client.setUser(user);
        client.setActive(true);
        try {
            user = clientRepository.saveAndFlush(client).getUser();
            String token = verificationTokenService.generateAccountVerificationToken(user).getToken();
            String verificationLink = appUrl + "/verify/activation?token=" + token;
            eventPublisher.publishEvent(new HtmlEmailEvent(this, user.getEmail(),
                    Map.of("name", user.getFirstName() + " " + user.getLastName(), "url", verificationLink), "verifyAccount", user.getLanguage()));
            return user;
        } catch (TokenGenerationException e) {
            throw new UserRegisteringException(MokExceptionMessages.UNEXPECTED_ERROR, MokErrorCodes.UNEXPECTED_ERROR, e);
        } catch (JpaSystemException e) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
    }

    public String signInOAuth(GoogleOauth2Response response, String remoteAddr) throws UserBlockedException, EmailAddressInUseException, JsonProcessingException {

        String token = response.getIdToken();
        String[] tokenChunks = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String tokenPayload = new String(decoder.decode(tokenChunks[1]));
        ObjectMapper mapper = new ObjectMapper();
        GoogleOauth2Payload payload = mapper.readValue(tokenPayload, GoogleOauth2Payload.class);

        User user;
        Optional<User> userOptional = userRepository.findByGoogleId(payload.getSub());
        if (userOptional.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(payload.getEmail());
            newUser.setFirstName(payload.getGivenName());
            newUser.setLastName(payload.getFamilyName());
            newUser.setVerified(true);
            newUser.setBlocked(false);
            newUser.setGoogleId(payload.getSub());
            newUser.setLastSuccessfulLogin(LocalDateTime.now());
            newUser.setLastSuccessfulLoginIp(remoteAddr);
            Client client = new Client();
            client.setUser(newUser);
            client.setActive(true);
            try {
                user = clientRepository.saveAndFlush(client).getUser();
            } catch (JpaSystemException e) {
                throw new EmailAddressInUseException(MokExceptionMessages.OAUTH_EMAIL_IN_USE, MokErrorCodes.OAUTH_EMAIL_IN_USE);
            }
        } else {
            user = userOptional.get();
            user.setLastSuccessfulLogin(LocalDateTime.now());
            user.setLastSuccessfulLoginIp(remoteAddr);
            userRepository.saveAndFlush(user);
        }

        if (user.isBlocked()) {
            throw new UserBlockedException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
        }
        log.info("Session started for user: {} - with id: {}, from address IP: {}, user logged in with external provider", user.getEmail(), user.getId(), remoteAddr);
        return jwtService.generateToken(user.getId(), userRolesService.getUserRoles(user.getId())).getTokenValue();
    }

    public void activateAccount(VerificationTokenDTO verificationTokenDTO) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
        VerificationToken verificationToken = verificationTokenService.validateAccountVerificationToken(verificationTokenDTO.token());
        User user = userRepository.findById(verificationToken.getUser().getId()).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        eventPublisher.publishEvent(new HtmlEmailEvent(
                this,
                user.getEmail(),
                Map.of("url", appUrl + "/login",
                        "name", user.getFirstName() + " " + user.getLastName()),
                "accountVerified",
                user.getLanguage()
        ));
        user.setVerified(true);
        userRepository.saveAndFlush(user);

    }

    public void resetPassword(ResetPasswordDTO resetPasswordDTO) throws UserNotVerifiedException, UserBlockedException, OauthUserException {
        Optional<User> userOptional = userRepository.findByEmail(resetPasswordDTO.email());
        if (userOptional.isPresent()) {

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
                token = verificationTokenService.generatePasswordVerificationToken(user).getToken();
            } catch (TokenGenerationException e) {
                log.error("Token generation error", e);
            }
            if (token != null) {
                String url = appUrl + "/verify/forgot-password?token=" + token;

                eventPublisher.publishEvent(new HtmlEmailEvent(
                        this,
                        user.getEmail(),
                        Map.of("url", url,
                                "name", user.getFirstName() + " " + user.getLastName()),
                        "passwordChange",
                        user.getLanguage()
                ));
            }
        }

    }

    public void changePassword(ChangePasswordWithTokenDTO passwordWithTokenDTO) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
        VerificationToken verificationToken = verificationTokenService.validatePasswordVerificationToken(passwordWithTokenDTO.token());
        User user = userRepository.findById(verificationToken.getUser().getId()).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(passwordWithTokenDTO.newPassword()));
        userRepository.saveAndFlush(user);
    }
}
