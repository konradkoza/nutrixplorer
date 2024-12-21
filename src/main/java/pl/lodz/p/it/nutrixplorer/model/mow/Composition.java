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
public class Composition extends AbstractEntity {

    @ManyToMany
    private List<Ingredient> ingredients = new ArrayList<>();

    @ManyToMany
    private List<Addition> additions = new ArrayList<>();

    @ManyToOne
    private Flavour flavour;

}
