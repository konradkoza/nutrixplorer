package pl.lodz.p.it.nutrixplorer.model.mow;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Ingredient extends AbstractEntity {

    @NotNull
    private String name;

}
