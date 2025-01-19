package pl.lodz.p.it.nutrixplorer.model.mok;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.io.Serializable;
import java.time.Instant;

@Table(name = "TOKEN",
uniqueConstraints = {
        @UniqueConstraint(columnNames = {"USER_ID", "PURPOSE"})
},
        indexes = {
                @Index(name = "idx_token_user_id", columnList = "USER_ID")
        }

)
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(discriminatorType = DiscriminatorType.STRING, name = "purpose")
public abstract class VerificationToken extends AbstractEntity implements Serializable {

    @Column(name = "TOKEN", nullable = false)
    private String token;

    @Column(name = "EXPIRATION_DATE", nullable = false)
    private Instant expirationDate;

    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID", nullable = false, updatable = false)
    private User user;

    @Override
    public String toString() {
        return "VerificationToken(token=" + "************" + ", expirationDate=" + this.getExpirationDate() + ", user=" + this.getUser() + ")";
    }
}
