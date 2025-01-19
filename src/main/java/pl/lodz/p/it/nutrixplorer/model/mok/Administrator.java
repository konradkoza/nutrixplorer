package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@DiscriminatorValue("ADMINISTRATOR")
@Table(name = "ADMINISTRATOR")
@NoArgsConstructor
@ToString(callSuper = true)
public class Administrator extends AccessLevel{
}
