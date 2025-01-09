package pl.lodz.p.it.nutrixplorer.mok.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.HtmlEmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.model.mok.VerificationToken;
import pl.lodz.p.it.nutrixplorer.mok.dto.GoogleOauth2Payload;
import pl.lodz.p.it.nutrixplorer.mok.dto.GoogleOauth2Response;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;
import pl.lodz.p.it.nutrixplorer.utils.PasswordHolder;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
@LoggingInterceptor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClientRepository clientRepository;
    private final AdministratorRepository administratorRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final VerificationTokenService verificationTokenService;

    @Value("${nutrixplorer.login.max-attempts:3}")
    private int maxLoginAttempts;

    @Value("${nutrixplorer.login.lock-duration:86400}")
    private int loginTimeOut;

    @Value("${nutrixplorer.frontend-url}")
    private String appUrl;

    @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
    public String login(String email, PasswordHolder password, String language, String remoteAddr) throws NotFoundException, AuthenctiactionFailedException, UserBlockedException, UserNotVerifiedException, LoginAttemptsExceededException {
        log.info("Logging in");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS));

        if (user.getLoginAttempts() >= maxLoginAttempts && Duration.between(user.getLastFailedLogin(), LocalDateTime.now()).toSeconds() <= loginTimeOut) {
            throw new LoginAttemptsExceededException(MokExceptionMessages.SIGN_IN_BLOCKED, MokErrorCodes.SIGN_IN_BLOCKED);
        } else if (user.getLoginAttempts() >= maxLoginAttempts) {
            user.setLoginAttempts(0);
        }

        if (user.getPassword() == null) {
            throw new AuthenctiactionFailedException(MokExceptionMessages.OAUTH2_USER, MokErrorCodes.OAUTH2_USER);
        }
        if (passwordEncoder.matches(password.getPassword(), user.getPassword())) {
            if (!user.isVerified()) {
                throw new UserNotVerifiedException(MokExceptionMessages.UNVERIFIED_ACCOUNT, MokErrorCodes.UNVERIFIED_ACCOUNT);
            }
            if (user.isBlocked()) {
                throw new UserBlockedException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
            }
            user.setLastSuccessfulLogin(LocalDateTime.now());
            user.setLoginAttempts(0);
            user.setLastSuccessfulLoginIp(remoteAddr);
            user.setLanguage(language);
            userRepository.saveAndFlush(user);
            log.info("Session started for user: {} - with id: {}, from address IP: {}", user.getEmail(), user.getId(), remoteAddr);
            return jwtService.generateToken(user.getId(), getUserRoles(user));
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

    @Transactional(propagation = Propagation.MANDATORY, isolation = Isolation.READ_COMMITTED)
    public List<String> getUserRoles(User user) {
        List<String> roles = new ArrayList<>();

        clientRepository.findByUserId(user.getId()).ifPresent(owner -> {
            if (owner.isActive()) {
                roles.add("CLIENT");
            }
        });
        administratorRepository.findByUserId(user.getId()).ifPresent(admin -> {
            if (admin.isActive()) {
                roles.add("ADMINISTRATOR");
            }
        });

        return roles;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {EmailAddressInUseException.class, UserRegisteringException.class}, isolation = Isolation.READ_COMMITTED)
    public User registerClient(String email, PasswordHolder password, String firstName, String lastName, String language) throws EmailAddressInUseException, UserRegisteringException {

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password.getPassword()));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setVerified(false);
        user.setBlocked(false);
        user.setLanguage(language);
        Client client = new Client();
        client.setUser(user);
        client.setActive(true);
        try {
            user = clientRepository.saveAndFlush(client).getUser();
            String token = verificationTokenService.generateAccountVerificationToken(user);
            String verificationLink = appUrl + "/verify/activation?token=" + token;
            eventPublisher.publishEvent(new HtmlEmailEvent(this, email,
                    Map.of("name", firstName + " " + lastName, "url", verificationLink), "verifyAccount", user.getLanguage()));
            return user;
        } catch (TokenGenerationException e) {
            throw new UserRegisteringException(MokExceptionMessages.UNEXPECTED_ERROR, MokErrorCodes.UNEXPECTED_ERROR, e);
        } catch (Exception e) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = EmailAddressInUseException.class, isolation = Isolation.READ_COMMITTED)
    public String signInOAuth(GoogleOauth2Response response, String remoteAddr) throws UserBlockedException, EmailAddressInUseException, Oauth2Exception, JsonProcessingException {

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
            } catch (Exception e) {
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
        return jwtService.generateToken(user.getId(), getUserRoles(user));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, NotFoundException.class}, isolation = Isolation.READ_COMMITTED)
    public void activateAccount(String token) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
        VerificationToken verificationToken = verificationTokenService.validateAccountVerificationToken(token);
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

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, UserBlockedException.class, UserNotVerifiedException.class}, isolation = Isolation.READ_COMMITTED)
    public void resetPassword(String email) throws UserNotVerifiedException, UserBlockedException, OauthUserException {
        Optional<User> userOptional = userRepository.findByEmail(email);
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
                token = verificationTokenService.generatePasswordVerificationToken(user);
            } catch (TokenGenerationException e) {
                log.error("Token generation error", e);
            }
            if (token != null) {
                String url = appUrl + "/verify/forgot-password?token=" + token;

                eventPublisher.publishEvent(new HtmlEmailEvent(
                        this,
                        email,
                        Map.of("url", url,
                                "name", user.getFirstName() + " " + user.getLastName()),
                        "passwordChange",
                        user.getLanguage()
                ));
            }
        }

    }

    public void changePassword(String token, PasswordHolder password) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
        VerificationToken verificationToken = verificationTokenService.validatePasswordVerificationToken(token);
        User user = userRepository.findById(verificationToken.getUser().getId()).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(password.getPassword()));
        userRepository.saveAndFlush(user);
    }
}
