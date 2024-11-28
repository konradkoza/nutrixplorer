package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;

import java.time.LocalDateTime;
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
    @JoinColumn(name = "client_id", nullable = false, updatable = false)
    private Client client;

    @Column(name = "name")
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
