package pl.lodz.p.it.nutrixplorer.model.mok;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;

import java.util.HashSet;
import java.util.Set;

@Entity
@DiscriminatorValue("CLIENT")
@Table(name = "CLIENT")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)
public class Client extends AccessLevel{

    @ManyToMany
    @JoinTable(
            name = "USER_FAVOURITE_PRODUCTS",
            joinColumns = @JoinColumn(name = "CLIENT_ID"),
            inverseJoinColumns = @JoinColumn(name = "PRODUCT_ID")
    )
    @ToString.Exclude
    private Set<Product> favouriteProducts = new HashSet<>();
}
