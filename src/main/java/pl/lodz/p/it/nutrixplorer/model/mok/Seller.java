package pl.lodz.p.it.nutrixplorer.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@DiscriminatorValue("SELLER")
@Table(name = "SELLERS")
public class Seller extends AccessLevel{
}
