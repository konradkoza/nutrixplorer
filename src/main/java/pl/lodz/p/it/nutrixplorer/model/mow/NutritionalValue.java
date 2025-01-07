package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "NUTRITIONAL_VALUE")
public class NutritionalValue extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name = "NUTRITIONALVALUENAME_ID")
    private NutritionalValueName nutritionalValueName;

    private Double quantity;

    @ManyToOne
    private Unit unit;

    private Double nrv; // Referencja wartości spożycia - RWS

    @ToString.Exclude
    @ManyToMany(mappedBy = "nutritionalValues")
    private Set<Product> products;
}
