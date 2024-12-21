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
@Table(name = "allergen")
public class Allergen extends AbstractEntity {
    @Column(name = "name")
    private String name;

}