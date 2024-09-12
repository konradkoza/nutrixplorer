package p.lodz.it.nutrixplorer.model;

import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class AbstractEntity {

    @Id
    private UUID id;
}
