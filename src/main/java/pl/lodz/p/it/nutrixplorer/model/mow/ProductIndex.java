package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.util.Objects;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "product_index")
public class ProductIndex extends AbstractEntity {

    private String indexName;

    private Integer indexValue;

    @Override
    public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductIndex that)) {
            return false;
        }

        return Objects.equals(getIndexName(), that.getIndexName()) && Objects.equals(getIndexValue(), that.getIndexValue());
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(getIndexName());
        result = 31 * result + Objects.hashCode(getIndexValue());
        return result;
    }
}
