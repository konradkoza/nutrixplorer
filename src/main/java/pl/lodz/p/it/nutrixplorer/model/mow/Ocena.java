package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "ocena")
public class Ocena {
    @EmbeddedId
    private OcenaId id;

    @Column(name = "nazwa_grupa", length = Integer.MAX_VALUE)
    private String nazwaGrupa;

    @Column(name = "nazwa_par", length = Integer.MAX_VALUE)
    private String nazwaPar;

    @Column(name = "value")
    private Boolean value;

    @Column(name = "data_dodania")
    private Instant dataDodania;

}