package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Basket extends AbstractEntity{

    @OneToMany
    private List<BasketEntry> basketEntry;

}
