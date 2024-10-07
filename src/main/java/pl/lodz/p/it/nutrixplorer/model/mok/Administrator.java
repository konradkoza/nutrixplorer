package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("ADMINISTRATOR")
@Table(name = "ADMINISTRATORS")
@NoArgsConstructor
public class Administrator extends AccessLevel{
}
