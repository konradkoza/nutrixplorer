package pl.lodz.p.it.nutrixplorer.model.mow;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "FLAVOUR")
public class Flavour extends AbstractEntity {

    @NotNull
    private String name;

}
