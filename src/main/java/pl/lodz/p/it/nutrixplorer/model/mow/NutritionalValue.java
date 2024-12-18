package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "nutritional_value")
public class NutritionalValue extends AbstractEntity {

    @ManyToOne
    private NutritionalValueName nutritionalValueName;

    private Double quantity;

    @ManyToOne
    private Unit unit;

    private Double nrv; // Referencja wartości spożycia - RWS

    @ManyToMany(mappedBy = "nutritionalValues")
    private Set<Product> products;
}
