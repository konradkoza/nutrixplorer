package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import java.time.Instant;

@DiscriminatorValue("PASSWORD")
@Entity
@Table(name = "PASSWORD_VERIFICATION_TOKEN")
@NoArgsConstructor
public class PasswordVerificationToken extends VerificationToken {

    public static int EXPIRATION_TIME = 15;

    public PasswordVerificationToken(String token, Instant expirationDate, User user) {
        super(token, expirationDate, user);
    }
}
