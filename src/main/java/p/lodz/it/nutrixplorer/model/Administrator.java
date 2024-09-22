package p.lodz.it.nutrixplorer.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@DiscriminatorValue("ADMINISTRATOR")
@Table(name = "ADMINISTRATORS")
public class Administrator extends AccessLevel{
}
