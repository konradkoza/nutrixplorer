package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Label extends AbstractEntity {

    private String storage;

    private String durability;

    @Column(name = "instructions_after_opening")
    private String instructionsAfterOpening;

    private String preparation;

    private String allergens;

    @ManyToMany
    @JoinTable(
            name = "label_allergen",
            joinColumns = @JoinColumn(name = "label_id"),
            inverseJoinColumns = @JoinColumn(name = "allergen_id")
    )
    private List<Allergen> allergenList;

    private byte[] image;

}
