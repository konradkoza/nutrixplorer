package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class OcenaId implements java.io.Serializable {
    @Serial
    private static final long serialVersionUID = 2091763456056687220L;
    @NotNull
    @Column(name = "id_produkt", nullable = false)
    private Integer idProdukt;

    @NotNull
    @Column(name = "id_parametr", nullable = false)
    private Integer idParametr;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OcenaId entity = (OcenaId) o;
        return Objects.equals(this.idProdukt, entity.idProdukt) &&
                Objects.equals(this.idParametr, entity.idParametr);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idProdukt, idParametr);
    }

}