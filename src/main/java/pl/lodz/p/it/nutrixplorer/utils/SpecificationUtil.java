package pl.lodz.p.it.nutrixplorer.utils;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.filtering.ProductSpecificationBuilder;
import pl.lodz.p.it.nutrixplorer.mow.filtering.SearchOperation;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class SpecificationUtil {

    public static Specification<Product> createSpecification(ProductsFilteringDTO filteringDTO) {
        ProductSpecificationBuilder builder = new ProductSpecificationBuilder();
        if (filteringDTO == null) {
            return null;
        }
        if (filteringDTO.country() != null) {
            builder.with("country", SearchOperation.CONTAINS, filteringDTO.country());
        }
        if (filteringDTO.ean() != null) {
            builder.with("ean", SearchOperation.EQUAL, filteringDTO.ean());
        }
        if (filteringDTO.productName() != null) {
            builder.with("productName", SearchOperation.CONTAINS, filteringDTO.productName());
        }
        if (filteringDTO.description() != null) {
            builder.with("productDescription", SearchOperation.CONTAINS, filteringDTO.description());
        }
        Specification<Product> specification = builder.build();
        if (specification == null) {
            specification = Specification.where(null);
        }
        if (filteringDTO.vitamins() != null && !filteringDTO.vitamins().isEmpty()) {
            specification = specification.and(hasAllNutritionalValues(filteringDTO.vitamins(), "Witaminy", "Witamina "));
        }
        if (filteringDTO.minerals() != null && !filteringDTO.minerals().isEmpty()) {
            specification = specification.and(hasAllNutritionalValues(filteringDTO.minerals(), "Minerały", ""));
        }
        if (filteringDTO.minCarbs() != null) {
            specification = specification.and(minSpecification("Total", "Węglowodany", Double.valueOf(filteringDTO.minCarbs())));
        }
        if (filteringDTO.maxCarbs() != null) {
            specification = specification.and(maxSpecification("Total", "Węglowodany", Double.valueOf(filteringDTO.maxCarbs())));
        }
        if (filteringDTO.minFat() != null) {
            specification = specification.and(minSpecification("Total", "Tłuszcz", Double.valueOf(filteringDTO.minFat())));
        }
        if (filteringDTO.maxFat() != null) {
            specification = specification.and(maxSpecification("Total", "Tłuszcz", Double.valueOf(filteringDTO.maxFat())));
        }
        if (filteringDTO.minProtein() != null) {
            specification = specification.and(minSpecification("Białko", "Białko", Double.valueOf(filteringDTO.minProtein())));
        }
        if (filteringDTO.maxProtein() != null) {
            specification = specification.and(maxSpecification("Białko", "Białko", Double.valueOf(filteringDTO.maxProtein())));
        }
        if (filteringDTO.minEnergy() != null) {
            specification = specification.and(minSpecification("Wartość Energetyczna", "Wartość Energetyczna", Double.valueOf(filteringDTO.minEnergy())));
        }
        if (filteringDTO.maxEnergy() != null) {
            specification = specification.and(maxSpecification("Wartość Energetyczna", "Wartość Energetyczna", Double.valueOf(filteringDTO.maxEnergy())));
        }
        if (filteringDTO.minFiber() != null) {
            specification = specification.and(minSpecification("Błonnik", "Błonnik", Double.valueOf(filteringDTO.minFiber())));
        }
        if (filteringDTO.maxFiber() != null) {
            specification = specification.and(maxSpecification("Błonnik", "Błonnik", Double.valueOf(filteringDTO.maxFiber())));
        }
        if (filteringDTO.packageType() != null) {
            specification = specification.and(packageSpecification(filteringDTO.packageType()));
        }
        if (filteringDTO.minIndexT() != null) {
            specification = specification.and(minIndexSpecification("T", filteringDTO.minIndexT()));
        }
        if (filteringDTO.maxIndexT() != null) {
            specification = specification.and(maxIndexSpecification("T", filteringDTO.maxIndexT()));
        }
        if (filteringDTO.minIndexS() != null) {
            specification = specification.and(minIndexSpecification("S", filteringDTO.minIndexS()));
        }
        if (filteringDTO.maxIndexS() != null) {
            specification = specification.and(maxIndexSpecification("S", filteringDTO.maxIndexS()));
        }
        if (filteringDTO.allergens() != null && !filteringDTO.allergens().isEmpty()) {
            specification = specification.and(hasNoAllergens(filteringDTO.allergens()));
        }

        return specification;
    }

    public static Specification<Product> hasAllNutritionalValues(List<String> values, String groupName, String namePrefix) {
        return (root, query, criteriaBuilder) -> {
            Join<Product, NutritionalValue> nutritionalValuesJoin = root.join("nutritionalValues", JoinType.INNER);

            Join<NutritionalValue, NutritionalValueName> nameJoin = nutritionalValuesJoin.join("nutritionalValueName", JoinType.INNER);

            Join<NutritionalValueName, NutritionalValueGroup> groupJoin = nameJoin.join("group", JoinType.INNER);

            if (query != null) {
                query.distinct(true); // Avoid duplicate products in result set
            }

            Predicate groupPredicate = criteriaBuilder.equal(groupJoin.get("groupName"), groupName);
            Predicate[] valuePredicates = values.stream()
                    .map(value -> criteriaBuilder.equal(nameJoin.get("name"), namePrefix + value))
                    .toArray(Predicate[]::new);

            return criteriaBuilder.and(groupPredicate, criteriaBuilder.and(valuePredicates));
        };
    }

    public static Specification<Product> hasNoAllergens(List<String> allergens) {
        return (root, query, criteriaBuilder) -> {
            Join<Product, Label> labelJoin = root.join("label", JoinType.INNER);

            Join<Label, Allergen> nameJoin = labelJoin.join("allergenList", JoinType.INNER);

            if (query != null) {
                query.distinct(true); // Avoid duplicate products in result set
            }

            Predicate[] valuePredicates = allergens.stream()
                    .map(value -> criteriaBuilder.notEqual(nameJoin.get("name"), value))
                    .toArray(Predicate[]::new);

            return criteriaBuilder.and(valuePredicates);
        };
    }

    static Specification<Product> packageSpecification(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.join("packageType").get("name"),
                name
        );
    }

    static Specification<Product> minIndexSpecification(String indexName, Integer value) {
        return (root, query, criteriaBuilder) -> {
            Predicate greaterThanPredicate = criteriaBuilder.greaterThanOrEqualTo(
                    root.join("productIndexes").get("indexValue"),
                    value
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    root.join("productIndexes").get("indexName"),
                    indexName
            );
            return criteriaBuilder.and(greaterThanPredicate, namePredicate);
        };
    }

    static Specification<Product> maxIndexSpecification(String indexName, Integer value) {
        return (root, query, criteriaBuilder) -> {
            Predicate lessThanPredicate = criteriaBuilder.lessThanOrEqualTo(
                    root.join("productIndexes").get("indexValue"),
                    value
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    root.join("productIndexes").get("indexName"),
                    indexName
            );
            return criteriaBuilder.and(lessThanPredicate, namePredicate);
        };
    }


    static Specification<Product> minSpecification(String nutritionalValueName, String groupName, Double quantity) {
        return (root, query, criteriaBuilder) -> {
            Predicate greaterThanPredicate = criteriaBuilder.greaterThanOrEqualTo(
                    root.join("nutritionalValues").get("quantity"),
                    quantity
            );
            Predicate groupNamePredicate = criteriaBuilder.equal(
                    root.join("nutritionalValues").join("nutritionalValueName").join("group").get("groupName"),
                    groupName
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    root.join("nutritionalValues").join("nutritionalValueName").get("name"),
                    nutritionalValueName
            );
            return criteriaBuilder.and(greaterThanPredicate, groupNamePredicate, namePredicate);
        };
    }

    static Specification<Product> maxSpecification(String nutritionalValueName, String groupName, Double quantity) {
        return (root, query, criteriaBuilder) -> {
            Predicate lessThanPredicate = criteriaBuilder.lessThanOrEqualTo(
                    root.join("nutritionalValues").get("quantity"),
                    quantity
            );
            Predicate groupNamePredicate = criteriaBuilder.equal(
                    root.join("nutritionalValues").join("nutritionalValueName").join("group").get("groupName"),
                    groupName
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    root.join("nutritionalValues").join("nutritionalValueName").get("name"),
                    nutritionalValueName
            );
            return criteriaBuilder.and(lessThanPredicate, groupNamePredicate, namePredicate);
        };
    }
}
