package p.lodz.it.nutrixplorer.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@DiscriminatorValue("CLIENT")
@Table(name = "CLIENTS")
public class Client extends AccessLevel{
}
