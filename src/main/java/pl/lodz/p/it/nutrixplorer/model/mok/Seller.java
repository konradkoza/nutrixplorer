package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("SELLER")
@Table(name = "SELLERS")
@NoArgsConstructor
public class Seller extends AccessLevel{

    @OneToOne(cascade = CascadeType.ALL)
    @Setter
    @JoinColumn(name = "address_id", nullable = true, updatable = true)
    private Address address;
}
