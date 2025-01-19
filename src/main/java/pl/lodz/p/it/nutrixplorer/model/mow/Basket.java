package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"CLIENT_ID", "NAME"})
        },
        name = "BASKET"
)
public class Basket extends AbstractEntity {


    @OneToMany(mappedBy = "basket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BasketEntry> basketEntries;

    @ManyToOne
    @JoinColumn(name = "CLIENT_ID", nullable = false, updatable = false)
    private Client client;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION", length = 2000)
    private String description;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
