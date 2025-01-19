package pl.lodz.p.it.nutrixplorer.model.mow;

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
@Entity
@Table( name = "ADDITION")
public class Addition extends AbstractEntity {

    private String name;

}
