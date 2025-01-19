package pl.lodz.p.it.nutrixplorer.mok.services.scheduling;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.TokenGenerationException;
import pl.lodz.p.it.nutrixplorer.mail.HtmlEmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.AccountVerificationToken;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AccountVerificationTokenRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;
import pl.lodz.p.it.nutrixplorer.mok.services.VerificationTokenService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED, transactionManager = "mokTransactionManager")
@RequiredArgsConstructor
@Slf4j
@LoggingInterceptor
public class AccountSchedulingService {

    @Value("${nutrixplorer.frontend-url}")
    private String appUrl;

    @Value("${nutrixplorer.remove-unverified:24}")
    private int hoursToRemoveUnverified;

    private final UserRepository userRepository;
    private final AccountVerificationTokenRepository accountVerificationTokenRepository;
    private final VerificationTokenService verificationTokenService;
    private final ApplicationEventPublisher eventPublisher;


    public void deleteNonVerifiedUsers() {
        LocalDateTime beforeTime = LocalDateTime.now().minusHours(hoursToRemoveUnverified);
        List<User> users = userRepository.getUsersByCreatedAtBeforeAndVerifiedIsFalse(beforeTime);
        users.forEach(user -> {
            eventPublisher.publishEvent(new HtmlEmailEvent(
                    this,
                    user.getEmail(),
                    Map.of("name", user.getFirstName() + " " + user.getLastName()),
                    "accountDelete",
                    user.getLanguage()
            ));
            userRepository.delete(user);
            userRepository.flush();
        });
    }

    public void sendEmailVerifyAccount() {
        LocalDateTime beforeTime = LocalDateTime.now().minusHours(hoursToRemoveUnverified / 2);
        LocalDateTime afterTime = beforeTime.plusMinutes(10);
        List<User> users = userRepository.getUsersToResendEmail(beforeTime, afterTime);
        users.forEach(user -> {
            Optional<AccountVerificationToken> tokenOptional = accountVerificationTokenRepository.findByUserId(user.getId());
            String token = null;
            if (tokenOptional.isEmpty()) {
                try {
                    token = verificationTokenService.generateAccountVerificationToken(user).getToken();
                } catch (TokenGenerationException e) {
                    log.error("Error while generating verification token", e);
                }
            } else {
                token = tokenOptional.get().getToken();
            }
            String url = appUrl + "/verify/activation?token=" + token;
            eventPublisher.publishEvent(new HtmlEmailEvent(
                    this,
                    user.getEmail(),
                    Map.of("name", user.getFirstName() + " " + user.getLastName(), "url", url),
                    "verifyAccount",
                    user.getLanguage()));
        });
    }
}
