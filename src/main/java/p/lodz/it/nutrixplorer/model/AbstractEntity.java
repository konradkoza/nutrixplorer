package p.lodz.it.nutrixplorer.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public abstract class AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "version", nullable = false)
    @Version
    private Long version;

}
