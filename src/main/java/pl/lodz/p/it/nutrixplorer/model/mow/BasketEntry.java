package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class BasketEntry extends AbstractEntity{

    @ManyToOne
    @NotNull
    private Product product;

    private Integer quantity;
}
