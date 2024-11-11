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
import pl.lodz.p.it.nutrixplorer.model.mok.Seller;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Deal extends AbstractEntity{

    @ManyToOne
    @NotNull
    @JoinColumn(name = "product_id", nullable = false, updatable = false)
    private Product product;

    private String name;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "old_price", precision = 10, scale = 2)
    private BigDecimal oldPrice;

    @Column(name = "new_price", precision = 10, scale = 2)
    private BigDecimal newPrice;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    private boolean active;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false, updatable = false)
    private Seller seller;
}
