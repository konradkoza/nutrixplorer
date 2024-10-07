package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Entity
@Getter
@NoArgsConstructor
@Table(
        name = "ACCESS_LEVELS",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "level"})
        })
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(discriminatorType = DiscriminatorType.STRING, name = "level")
public abstract class AccessLevel extends AbstractEntity implements Serializable {

    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, updatable = false)
    @OneToOne(optional = false, cascade = CascadeType.PERSIST)
    private User user;
}
