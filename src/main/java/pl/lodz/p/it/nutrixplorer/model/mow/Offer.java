package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.mok.User;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Offer extends AbstractEntity{

    @ManyToOne
    @NotNull
    @JoinColumn(name = "product_id", nullable = false, updatable = false)
    private Product product;

    private String name;

    private String description;

    @Column(name = "old_price", precision = 10, scale = 2)
    private BigDecimal oldPrice;

    @Column(name = "new_price", precision = 10, scale = 2)
    private BigDecimal newPrice;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;
}
