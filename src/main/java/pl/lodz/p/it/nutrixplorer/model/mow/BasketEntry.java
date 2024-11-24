package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "basket_entry")
public class BasketEntry extends AbstractEntity{

    @ManyToOne
    @NotNull
    @JoinColumn(name = "product_id", nullable = false, updatable = false)
    private Product product;

    @Column(name = "quantity", precision = 10, scale = 2)
    private BigDecimal units;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "basket_id", nullable = false, updatable = false)
    private Basket basket;
}
