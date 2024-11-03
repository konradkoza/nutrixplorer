package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;

import java.util.HashSet;
import java.util.Set;

@Entity
@DiscriminatorValue("CLIENT")
@Table(name = "CLIENTS")
@NoArgsConstructor
@Getter
@Setter
public class Client extends AccessLevel{

    @ManyToMany
    @JoinTable(
            name = "user_favourite_products",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> favouriteProducts = new HashSet<>();
}
