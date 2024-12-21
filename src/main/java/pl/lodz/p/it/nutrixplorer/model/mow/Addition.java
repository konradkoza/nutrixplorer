package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Entity;
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
public class Addition extends AbstractEntity {

    private String name;

}
