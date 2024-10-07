package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class WartoscOdzywczaId implements java.io.Serializable {
    private static final long serialVersionUID = 2079159713689748061L;
    @NotNull
    @Column(name = "id_produkt", nullable = false)
    private Integer idProdukt;

    @NotNull
    @Column(name = "id_nutrient", nullable = false)
    private Integer idNutrient;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        WartoscOdzywczaId entity = (WartoscOdzywczaId) o;
        return Objects.equals(this.idProdukt, entity.idProdukt) &&
                Objects.equals(this.idNutrient, entity.idNutrient);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idProdukt, idNutrient);
    }

}