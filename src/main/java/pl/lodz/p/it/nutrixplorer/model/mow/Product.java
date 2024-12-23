package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Product extends AbstractEntity {

    @Size(max = 13)
    private String ean;

    @ManyToOne
    private Producer producer;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_description")
    private String productDescription;

    @Column(name = "product_quantity")
    private Integer productQuantity;

    @ManyToOne
    private Unit unit;

    @ManyToOne
    private PackageType packageType;

    @Column(name = "country", length = Integer.MAX_VALUE)
    private String country;

    @OneToOne
    private Composition composition;

    @ManyToMany
    private Set<NutritionalIndex> nutritionalIndexes;

    @ManyToMany
    private Set<ProductIndex> productIndexes;

    @OneToOne
    private Label label;

    @OneToOne
    private Portion portion;

    @ManyToMany
    @JoinTable(
            name = "product_rating",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "ratings_id")
    )
    private Set<Rating> ratings;

    @ManyToMany
    @JoinTable(
            name = "product_nutritional_value", // name of the join table
            joinColumns = @JoinColumn(name = "product_id"), // column referencing Product
            inverseJoinColumns = @JoinColumn(name = "nutritionalvalues_id") // column referencing NutritionalValue
    )
    private List<NutritionalValue> nutritionalValues;

    @ManyToMany(mappedBy = "favouriteProducts")
    @ToString.Exclude
    private Set<Client> usersWhoFavourited = new HashSet<>();
}
