package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.TokenGenerationException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.VerificationTokenExpiredException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.VerificationTokenInvalidException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.*;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AccountVerificationTokenRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.EmailVerificationTokenRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.PasswordVerificationTokenRepository;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.MANDATORY, isolation = Isolation.READ_COMMITTED, rollbackFor = BaseWebException.class, transactionManager = "mokTransactionManager")
@LoggingInterceptor
public class VerificationTokenService {
    private final AccountVerificationTokenRepository accountTokenRepository;
    private final EmailVerificationTokenRepository emailTokenRepository;
    private final PasswordVerificationTokenRepository passwordTokenRepository;

    @PreAuthorize("permitAll()")
    public VerificationToken generateAccountVerificationToken(User user) throws TokenGenerationException {
        String tokenVal = generateSafeToken();
        accountTokenRepository.deleteByUserId(user.getId());
        accountTokenRepository.flush();
        AccountVerificationToken token = new AccountVerificationToken(tokenVal, Instant.now().plus(AccountVerificationToken.EXPIRATION_TIME, ChronoUnit.MINUTES), user);
        return accountTokenRepository.saveAndFlush(token);
    }

    @PreAuthorize("permitAll()")
    public VerificationToken validateAccountVerificationToken(String token) throws VerificationTokenExpiredException, VerificationTokenInvalidException {
        VerificationToken verificationToken = accountTokenRepository.findByToken(token).orElseThrow(() -> new VerificationTokenInvalidException(MokExceptionMessages.VERIFICATION_TOKEN_INVALID, MokErrorCodes.VERIFICATION_TOKEN_INVALID));
        if (verificationToken.getExpirationDate().isBefore(Instant.now())) {
            throw new VerificationTokenExpiredException(MokExceptionMessages.VERIFICATION_TOKEN_EXPIRED, MokErrorCodes.VERIFICATION_TOKEN_EXPIRED);
        }
        accountTokenRepository.deleteById(verificationToken.getId());
        return verificationToken;
    }

    @PreAuthorize("isAuthenticated()")
    public VerificationToken generateEmailVerificationToken(User user, String newEmail) throws TokenGenerationException {
        String tokenVal = generateSafeToken();
        emailTokenRepository.deleteEmailVerificationTokenByUserId(user.getId());
        emailTokenRepository.flush();
        EmailVerificationToken token = new EmailVerificationToken(tokenVal, Instant.now().plus(EmailVerificationToken.EXPIRATION_TIME, ChronoUnit.MINUTES), user, newEmail);
        return emailTokenRepository.saveAndFlush(token);
    }

    @PreAuthorize("permitAll()")
    public VerificationToken validateEmailVerificationToken(String token) throws VerificationTokenExpiredException, VerificationTokenInvalidException {
        EmailVerificationToken verificationToken = emailTokenRepository.findByToken(token).orElseThrow(() -> new VerificationTokenInvalidException(MokExceptionMessages.VERIFICATION_TOKEN_INVALID, MokErrorCodes.VERIFICATION_TOKEN_INVALID));
        if (verificationToken.getExpirationDate().isBefore(Instant.now())) {
            throw new VerificationTokenExpiredException(MokExceptionMessages.VERIFICATION_TOKEN_EXPIRED, MokErrorCodes.VERIFICATION_TOKEN_EXPIRED);
        }
        emailTokenRepository.deleteById(verificationToken.getId());
        return verificationToken;
    }

    @PreAuthorize("permitAll()")
    public VerificationToken generatePasswordVerificationToken(User user) throws TokenGenerationException {
        String tokenVal = generateSafeToken();
        passwordTokenRepository.deleteByUserId(user.getId());
        passwordTokenRepository.flush();
        PasswordVerificationToken token = new PasswordVerificationToken(tokenVal, Instant.now().plus(PasswordVerificationToken.EXPIRATION_TIME, ChronoUnit.MINUTES), user);
        return passwordTokenRepository.saveAndFlush(token);
    }

    @PreAuthorize("permitAll()")
    public VerificationToken validatePasswordVerificationToken(String token) throws VerificationTokenExpiredException, VerificationTokenInvalidException {
        PasswordVerificationToken verificationToken = passwordTokenRepository.findByToken(token).orElseThrow(() -> new VerificationTokenInvalidException(MokExceptionMessages.VERIFICATION_TOKEN_INVALID, MokErrorCodes.VERIFICATION_TOKEN_INVALID));
        if (verificationToken.getExpirationDate().isBefore(Instant.now())) {
            throw new VerificationTokenExpiredException(MokExceptionMessages.VERIFICATION_TOKEN_EXPIRED, MokErrorCodes.VERIFICATION_TOKEN_EXPIRED);
        }
        passwordTokenRepository.deleteById(verificationToken.getId());
        return verificationToken;
    }

    private String generateSafeToken() throws TokenGenerationException {
        String chars = "0123456789abcdefghijklmnopqrstuvwxyz-_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        try {
            SecureRandom random = SecureRandom.getInstanceStrong();
            return random.ints(32, 0, chars.length())
                    .mapToObj(chars::charAt)
                    .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                    .toString();
        } catch (NoSuchAlgorithmException e) {
            throw new TokenGenerationException(MokExceptionMessages.TOKEN_GENERATION_ERROR, MokErrorCodes.TOKEN_GENERATION_ERROR, e);
        }
    }
}
