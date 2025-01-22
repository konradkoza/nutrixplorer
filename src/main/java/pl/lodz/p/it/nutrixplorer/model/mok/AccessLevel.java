package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.io.Serializable;

@Setter
@Entity
@Getter
@NoArgsConstructor
@Table(
        name = "ACCESS_LEVEL",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"USER_ID", "LEVEL"})
        })
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(discriminatorType = DiscriminatorType.STRING, name = "level")
@ToString(callSuper = true)
public abstract class AccessLevel extends AbstractEntity implements Serializable {
//    @Serial
//    private static final long serialVersionUID = 1L;

    @Column(name = "ACTIVE", nullable = false)
    private boolean active;

    @JoinColumn(name = "USER_ID", referencedColumnName = "ID", nullable = false, updatable = false)
    @ManyToOne(optional = false, cascade = CascadeType.PERSIST)
    @ToString.Exclude
    private User user;
}
