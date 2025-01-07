package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "NUTRITIONAL_VALUE_GROUP")
public class NutritionalValueGroup extends AbstractEntity {

    @Column(name = "GROUPNAME")
    private String groupName;
}
