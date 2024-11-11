package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.lodz.p.it.nutrixplorer.model.mow.Deal;

import java.util.HashSet;
import java.util.Set;

@Entity
@DiscriminatorValue("SELLER")
@Table(name = "SELLERS")
@NoArgsConstructor
@Getter
public class Seller extends AccessLevel{

    @OneToOne(cascade = CascadeType.ALL)
    @Setter
    @JoinColumn(name = "address_id", nullable = true, updatable = true)
    private Address address;

    @OneToMany(mappedBy = "seller")
    private Set<Deal> sellerDeals = new HashSet<>();
}
