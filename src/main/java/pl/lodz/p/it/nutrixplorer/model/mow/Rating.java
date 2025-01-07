package pl.lodz.p.it.nutrixplorer.model.mow;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;

import java.util.Objects;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "RATING")
public class Rating extends AbstractEntity {

    @Column(name = "GROUP_NAME")
    private String groupName;

    private String name;

    @JsonBackReference
    @ToString.Exclude
    @ManyToMany(mappedBy = "ratings")
    private Set<Product> products;

    @Override
    public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rating rating)) {
            return false;
        }

        return Objects.equals(getGroupName(), rating.getGroupName()) && Objects.equals(getName(), rating.getName());
    }

    @Override
    public int hashCode() {
        int result = Objects.hashCode(getGroupName());
        result = 31 * result + Objects.hashCode(getName());
        return result;
    }
}
