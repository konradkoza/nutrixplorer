package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "nutritional_index")
public class NutritionalIndex extends AbstractEntity {

    @Column(name = "index_value")
    private Integer indexValue;

    private String legend;

    @Override
    public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NutritionalIndex that)) {
            return false;
        }

        return Objects.equals(getIndexValue(), that.getIndexValue()) && Objects.equals(getLegend(), that.getLegend());
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(getIndexValue());
        result = 31 * result + Objects.hashCode(getLegend());
        return result;
    }
}
