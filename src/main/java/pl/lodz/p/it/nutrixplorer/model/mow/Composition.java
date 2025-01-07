package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;


import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "COMPOSITION")
public class Composition extends AbstractEntity {

    @ManyToMany
    @JoinTable(name = "COMPOSITION_INGREDIENT")
    private List<Ingredient> ingredients = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "COMPOSITION_ADDITION")
    private List<Addition> additions = new ArrayList<>();

    @ManyToOne
    private Flavour flavour;

}
