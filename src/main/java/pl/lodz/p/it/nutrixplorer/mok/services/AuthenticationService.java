package pl.lodz.p.it.nutrixplorer.mok.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.EmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.model.mok.VerificationToken;
import pl.lodz.p.it.nutrixplorer.mok.dto.GoogleOauth2Payload;
import pl.lodz.p.it.nutrixplorer.mok.dto.GoogleOauth2Response;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor =
        {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, NotFoundException.class, TokenGenerationException.class})
@LoggingInterceptor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClientRepository clientRepository;
    private final AdministratorRepository administratorRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final VerificationTokenService verificationTokenService;


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public String login(String email, String password) throws NotFoundException, AuthenctiactionFailedException, UserBlockedException, UserNotVerifiedException {
        log.info("Logging in");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS));


        if (user.getPassword() == null) {
            throw new AuthenctiactionFailedException(MokExceptionMessages.OAUTH2_USER, MokErrorCodes.OAUTH2_USER);
        }
        if (passwordEncoder.matches(password, user.getPassword())) {
            if (!user.isVerified()) {
                throw new UserNotVerifiedException(MokExceptionMessages.UNVERIFIED_ACCOUNT, MokErrorCodes.ACCOUNT_BLOCKED);
            }
            if (user.isBlocked()) {
                throw new UserBlockedException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
            }
            return jwtService.generateToken(user.getId(), getUserRoles(user));
        } else {
            throw new AuthenctiactionFailedException(MokExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS);
        }
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public List<String> getUserRoles(User user) {
        List<String> roles = new ArrayList<>();

        clientRepository.findByUserId(user.getId()).ifPresent(owner -> roles.add("CLIENT"));
        administratorRepository.findByUserId(user.getId()).ifPresent(admin -> roles.add("ADMINISTRATOR"));

        return roles;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {EmailAddressInUseException.class, UserRegisteringException.class})
    public User registerClient(String email, String password, String firstName, String lastName) throws EmailAddressInUseException, UserRegisteringException {

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setVerified(false);
        user.setBlocked(false);
        Client client = new Client();
        client.setUser(user);
        try {
            user = clientRepository.saveAndFlush(client).getUser();
            String token = verificationTokenService.generateAccountVerificationToken(user);
            String verificationLink = "http://localhost:3000/verify/activation?token=" + token;
            eventPublisher.publishEvent(new EmailEvent(this, email, "Verify your account in NutriXplorer", "Hello " + firstName + " " + lastName + "\nPlease verify your account by clicking the link below:\n" + verificationLink));
            return user;
        } catch (TokenGenerationException e) {
            throw new UserRegisteringException(MokExceptionMessages.UNEXPECTED_ERROR, MokErrorCodes.UNEXPECTED_ERROR, e);
        } catch (Exception e) {
            throw new EmailAddressInUseException(MokExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = EmailAddressInUseException.class)
    public String signInOAuth(GoogleOauth2Response response) throws UserBlockedException, EmailAddressInUseException, Oauth2Exception, JsonProcessingException {

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
            Client client = new Client();
            client.setUser(newUser);
            try {
                user = clientRepository.saveAndFlush(client).getUser();
            } catch (Exception e) {
                throw new EmailAddressInUseException(MokExceptionMessages.OAUTH_EMAIL_IN_USE, MokErrorCodes.OAUTH_EMAIL_IN_USE);
            }
        } else {
            user = userOptional.get();
        }

        if (user.isBlocked()) {
            throw new UserBlockedException(MokExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
        }
        return jwtService.generateToken(user.getId(), getUserRoles(user));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = {VerificationTokenInvalidException.class, VerificationTokenExpiredException.class, NotFoundException.class})
    public void activateAccount(String token) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
        VerificationToken verificationToken = verificationTokenService.validateAccountVerificationToken(token);
        User user = userRepository.findById(verificationToken.getUser().getId()).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
        eventPublisher.publishEvent(new EmailEvent(this, user.getEmail(), "Account activated", "Hello " + user.getFirstName() + " " + user.getLastName() + "\nYour account has been activated successfully"));
        user.setVerified(true);
        userRepository.saveAndFlush(user);

    }


    public void resetPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = null;
            try {
                token = verificationTokenService.generatePasswordVerificationToken(user);
            } catch (TokenGenerationException e) {
                log.error("Token generation error", e);
            }
            if (token != null) {
                String url = "http://localhost:3000/verify/forgot-password?token=" + token;
                eventPublisher.publishEvent(
                        new EmailEvent(this,
                                            email,
                                "Reset your password in NutriXplorer",
                                "Hello " + user.getFirstName() + " " + user.getLastName() + "\nPlease reset your password by clicking the link below:\n" + url));
            }
        });
    }

    public void changePassword(String token, String password) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
            VerificationToken verificationToken = verificationTokenService.validatePasswordVerificationToken(token);
            User user = userRepository.findById(verificationToken.getUser().getId()).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
            user.setPassword(passwordEncoder.encode(password));
            userRepository.saveAndFlush(user);
            eventPublisher.publishEvent(new EmailEvent(this, user.getEmail(), "Password changed", "Hello " + user.getFirstName() + " " + user.getLastName() + "\nYour password has been changed successfully"));

    }
}
