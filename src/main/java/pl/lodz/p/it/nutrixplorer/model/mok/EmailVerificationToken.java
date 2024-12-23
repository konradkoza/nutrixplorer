package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@DiscriminatorValue("EMAIL")
@Entity
@Table(name = "EMAIL_VERIFICATION_TOKENS")
@NoArgsConstructor
@Getter
public class EmailVerificationToken extends VerificationToken {

    public static int EXPIRATION_TIME = 15;

    private String newEmail;

    public EmailVerificationToken(String token, Instant expirationDate, User user, String newEmail) {
        super(token, expirationDate, user);
        this.newEmail = newEmail;
    }
}
