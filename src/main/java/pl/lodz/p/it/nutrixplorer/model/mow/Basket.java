package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.mok.User;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Basket extends AbstractEntity{


    @OneToMany(mappedBy = "basket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BasketEntry> basketEntries;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    private String name;

    private String description;
}
