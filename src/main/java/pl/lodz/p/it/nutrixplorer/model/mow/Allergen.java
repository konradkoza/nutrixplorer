package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

@Getter
@Setter
@Entity
@Table(name = "ALLERGEN")
public class Allergen extends AbstractEntity {
    @Column(name = "NAME")
    private String name;

}