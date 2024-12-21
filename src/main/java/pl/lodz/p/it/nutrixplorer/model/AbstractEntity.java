package pl.lodz.p.it.nutrixplorer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
@ToString
public class AbstractEntity {

    @Id
    @Column(name = "id", columnDefinition = "UUID", updatable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Version
    @Column(nullable = false)
    private Long version;
}
