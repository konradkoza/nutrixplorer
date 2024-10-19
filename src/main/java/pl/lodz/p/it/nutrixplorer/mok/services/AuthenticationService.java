package pl.lodz.p.it.nutrixplorer.mok.services;

import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.*;
import pl.lodz.p.it.nutrixplorer.exceptions.codes.ErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.messages.UserExceptionMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.Seller;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.SellerRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ClientRepository clientRepository;
    private final SellerRepository sellerRepository;
    private final AdministratorRepository administratorRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public String login(String email, String password) throws NotFoundException, AuthenctiactionFailedException, UserBlockedException, UserNotVerifiedException {
        log.info("Logging in");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException(UserExceptionMessages.NOT_FOUND, ErrorCodes.USER_NOT_FOUND));
//        if (!user.isVerified()) {
//            throw new UserNotVerifiedException(UserExceptionMessages.UNVERIFIED_ACCOUNT, ErrorCodes.ACCOUNT_BLOCKED);
//        }

        if (user.isBlocked()) {
            throw new UserBlockedException(UserExceptionMessages.ACCOUNT_BLOCKED, ErrorCodes.ACCOUNT_BLOCKED);
        }
        if (passwordEncoder.matches(password, user.getPassword())) {
            return jwtService.generateToken(user.getId(), getUserRoles(user));
        } else {
            throw new AuthenctiactionFailedException(UserExceptionMessages.INVALID_CREDENTIALS, ErrorCodes.INVALID_CREDENTIALS);
        }
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public List<String> getUserRoles(User user) {
        List<String> roles = new ArrayList<>();

        clientRepository.findByUserId(user.getId()).ifPresent(owner -> roles.add("CLIENT"));
        sellerRepository.findByUserId(user.getId()).ifPresent(tenant -> roles.add("SELLER"));
        administratorRepository.findByUserId(user.getId()).ifPresent(admin -> roles.add("ADMINISTRATOR"));

        return roles;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User registerClient(String email, String password, String firstName, String lastName) throws EmailAddressInUseException {
        User user = createBasicUser(email, password, firstName, lastName);
        Client client = new Client();
        client.setUser(user);
        try {
            return clientRepository.saveAndFlush(client).getUser();
        } catch (ConstraintViolationException e) {
            throw new EmailAddressInUseException(UserExceptionMessages.EMAIL_IN_USE, ErrorCodes.EMAIL_IN_USE);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User registerSeller(String email, String password, String firstName, String lastName) throws EmailAddressInUseException {
        User user = createBasicUser(email, password, firstName, lastName);
        Seller seller = new Seller();
        seller.setUser(user);
        try {
            return sellerRepository.saveAndFlush(seller).getUser();
        } catch (ConstraintViolationException e) {
            throw new EmailAddressInUseException(UserExceptionMessages.EMAIL_IN_USE, ErrorCodes.EMAIL_IN_USE);
        }
    }

    private User createBasicUser(String email, String password, String firstName, String lastName) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setVerified(false);
        user.setBlocked(false);
        return user;
    }

}
