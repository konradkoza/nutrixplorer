package pl.lodz.p.it.nutrixplorer.model.mow;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Flavour extends AbstractEntity {

    @NotNull
    private String name;

}
