package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "BASKET_ENTRY", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"PRODUCT_ID", "BASKET_ID"})
})
@AllArgsConstructor
public class BasketEntry extends AbstractEntity {

    @ManyToOne
    @NotNull
    @JoinColumn(name = "PRODUCT_ID", nullable = false, updatable = false)
    private Product product;

    @Column(name = "QUANTITY", precision = 10, scale = 2)
    private BigDecimal units;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "BASKET_ID", nullable = false, updatable = false)
    @ToString.Exclude
    private Basket basket;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public BasketEntry(Product product, BigDecimal units, Basket basket) {
        this.product = product;
        this.units = units;
        this.basket = basket;
    }
}
