package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import java.time.Instant;

@DiscriminatorValue("ACCOUNT")
@Entity
@Table(name = "ACCOUNT_VERIFICATION_TOKEN")
@NoArgsConstructor
public class AccountVerificationToken extends VerificationToken {
    public static int EXPIRATION_TIME = 24 * 60;

    public AccountVerificationToken(String token, Instant expirationDate, User user) {
        super(token, expirationDate, user);
    }
}
