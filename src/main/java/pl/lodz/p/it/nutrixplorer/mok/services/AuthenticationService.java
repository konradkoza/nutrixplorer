package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.AuthenctiactionFailedException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.EmailAddressInUseException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.UserBlockedException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.UserNotVerifiedException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.UserExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.EmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.dto.ErrorResponseDTO;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
@LoggingInterceptor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClientRepository clientRepository;
    private final AdministratorRepository administratorRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public String login(String email, String password) throws NotFoundException, AuthenctiactionFailedException, UserBlockedException, UserNotVerifiedException {
        log.info("Logging in");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AuthenctiactionFailedException(UserExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS));
//        if (!user.isVerified()) {
//            throw new UserNotVerifiedException(UserExceptionMessages.UNVERIFIED_ACCOUNT, ErrorCodes.ACCOUNT_BLOCKED);
//        }

        if (user.isBlocked()) {
            throw new UserBlockedException(UserExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
        }
        if (user.getPassword() == null) {
            throw new AuthenctiactionFailedException(UserExceptionMessages.OAUTH2_USER, MokErrorCodes.OAUTH2_USER);
        }
        if (passwordEncoder.matches(password, user.getPassword())) {
            return jwtService.generateToken(user.getId(), getUserRoles(user));
        } else {
            throw new AuthenctiactionFailedException(UserExceptionMessages.INVALID_CREDENTIALS, MokErrorCodes.INVALID_CREDENTIALS);
        }
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public List<String> getUserRoles(User user) {
        List<String> roles = new ArrayList<>();

        clientRepository.findByUserId(user.getId()).ifPresent(owner -> roles.add("CLIENT"));
        administratorRepository.findByUserId(user.getId()).ifPresent(admin -> roles.add("ADMINISTRATOR"));

        return roles;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User registerClient(String email, String password, String firstName, String lastName) throws EmailAddressInUseException {
        eventPublisher.publishEvent(new EmailEvent(this, email, "Welcome to Nutrixplorer", "Hello " + firstName + " " + lastName +"\nWelcome to Nutrixplorer!"));
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
            return clientRepository.saveAndFlush(client).getUser();
        } catch (Exception e) {
            throw new EmailAddressInUseException(UserExceptionMessages.EMAIL_IN_USE, MokErrorCodes.EMAIL_IN_USE);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = EmailAddressInUseException.class)
    public String signInOAuth(ErrorResponseDTO.GoogleOauth2Payload payload) throws UserBlockedException, EmailAddressInUseException {
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
                throw new EmailAddressInUseException(UserExceptionMessages.OAUTH_EMAIL_IN_USE, MokErrorCodes.OAUTH_EMAIL_IN_USE);
            }
        } else {
            user = userOptional.get();
        }

        if (user.isBlocked()) {
            throw new UserBlockedException(UserExceptionMessages.ACCOUNT_BLOCKED, MokErrorCodes.ACCOUNT_BLOCKED);
        }
        return jwtService.generateToken(user.getId(), getUserRoles(user));
    }
}
