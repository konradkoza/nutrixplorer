package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@Entity
@Table(name = "BASKET_ENTRY", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"PRODUCT_ID", "BASKET_ID"})
})
public class BasketEntry extends AbstractEntity {

    @ManyToOne
    @NotNull
    @JoinColumn(name = "PRODUCT_ID", nullable = false, updatable = false)
    private Product product;

    @Column(name = "QUANTITY", precision = 10, scale = 2, nullable = false)
    private BigDecimal units;


    @ManyToOne
    @JoinColumn(name = "BASKET_ID", nullable = false, updatable = false)
    @ToString.Exclude
    private Basket basket;


    public BasketEntry(Product product, BigDecimal units, Basket basket) {
        this.product = product;
        this.units = units;
        this.basket = basket;
    }
}
