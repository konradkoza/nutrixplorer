package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "LABEL")
public class Label extends AbstractEntity {

    private String storage;

    private String durability;

    @Column(name = "INSTRUCTIONS_AFTER_OPENING")
    private String instructionsAfterOpening;

    private String preparation;

    private String allergens;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "LABEL_ALLERGEN",
            joinColumns = @JoinColumn(name = "LABEL_ID"),
            inverseJoinColumns = @JoinColumn(name = "ALLERGEN_ID")
    )
    private List<Allergen> allergenList;

    @ToString.Exclude
    private byte[] image;

}
