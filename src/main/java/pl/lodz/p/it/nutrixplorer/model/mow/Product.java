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
@Table(name = "PRODUCT")
public class Product extends AbstractEntity {

    @Size(max = 13)
    private String ean;

    @ManyToOne
    private Producer producer;

    @Column(name = "PRODUCT_NAME", nullable = false)
    private String productName;

    @Column(name = "PRODUCT_DESCRIPTION")
    private String productDescription;

    @Column(name = "PRODUCT_QUANTITY")
    private Integer productQuantity;

    @ManyToOne
    private Unit unit;

    @ManyToOne
    @JoinColumn(name = "PACKAGETYPE_ID")
    private PackageType packageType;

    @Column(name = "COUNTRY", length = Integer.MAX_VALUE)
    private String country;

    @OneToOne
    private Composition composition;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "PRODUCT_NUTRITIONAL_INDEX", joinColumns = @JoinColumn(name = "PRODUCT_ID"),  inverseJoinColumns = @JoinColumn(name = "NUTRITIONALINDEXES_ID"))
    private Set<NutritionalIndex> nutritionalIndexes;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "PRODUCT_PRODUCT_INDEX",joinColumns = @JoinColumn(name = "PRODUCT_ID"),  inverseJoinColumns = @JoinColumn(name = "PRODUCTINDEXES_ID"))
    private Set<ProductIndex> productIndexes;

    @OneToOne
    private Label label;

    @OneToOne
    private Portion portion;

    @ManyToMany
    @JoinTable(
            name = "PRODUCT_RATING",
            joinColumns = @JoinColumn(name = "PRODUCT_ID"),
            inverseJoinColumns = @JoinColumn(name = "RATINGS_ID")
    )
    private Set<Rating> ratings;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "PRODUCT_NUTRITIONAL_VALUE", // name of the join table
            joinColumns = @JoinColumn(name = "PRODUCT_ID"), // column referencing Product
            inverseJoinColumns = @JoinColumn(name = "NUTRITIONALVALUES_ID") // column referencing NutritionalValue
    )
    private List<NutritionalValue> nutritionalValues;

    @ManyToMany(mappedBy = "favouriteProducts")
    @ToString.Exclude
    private Set<Client> usersWhoFavourited = new HashSet<>();
}
