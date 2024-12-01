package pl.lodz.p.it.nutrixplorer.utils;

import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.filtering.ProductSpecificationBuilder;
import pl.lodz.p.it.nutrixplorer.mow.filtering.SearchOperation;

import java.util.List;

@Slf4j
public class ProductSpecificationUtil {

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
            specification = specification.and(hasAllNutritionalValues2(filteringDTO.vitamins(), "Witaminy", "Witamina "));
        }
        if (filteringDTO.minerals() != null && !filteringDTO.minerals().isEmpty()) {
            specification = specification.and(hasAllNutritionalValues2(filteringDTO.minerals(), "Minerały", ""));
        }
        if (filteringDTO.minCarbs() != null) {
            specification = specification.and(minSpecification("Total", "Węglowodany", Double.valueOf(filteringDTO.minCarbs())));
        }
        if (filteringDTO.maxCarbs() != null) {
            specification = specification.and(maxSpecification2("Total", "Węglowodany", Double.valueOf(filteringDTO.maxCarbs())));
        }
        if (filteringDTO.minFat() != null) {
            specification = specification.and(minSpecification("Total", "Tłuszcz", Double.valueOf(filteringDTO.minFat())));
        }
        if (filteringDTO.maxFat() != null) {
            specification = specification.and(maxSpecification2("Total", "Tłuszcz", Double.valueOf(filteringDTO.maxFat())));
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
        if (filteringDTO.minIndexV() != null) {
            specification = specification.and(minIndexSpecification("V", filteringDTO.minIndexV()));
        }
        if (filteringDTO.minIndexE() != null) {
            specification = specification.and(minIndexSpecification("E", filteringDTO.minIndexE()));
        }
        if (filteringDTO.minIndexF() != null) {
            specification = specification.and(minIndexSpecification("F", filteringDTO.minIndexF()));
        }
        if (filteringDTO.minIndexM() != null) {
            specification = specification.and(minIndexSpecification("M", filteringDTO.minIndexM()));
        }
        if (filteringDTO.minIndexO() != null) {
            specification = specification.and(minIndexSpecification("O", filteringDTO.minIndexO()));
        }
        if (filteringDTO.minIndexP() != null) {
            specification = specification.and(minIndexSpecification("P", filteringDTO.minIndexP()));
        }
        if (filteringDTO.minIndexT() != null) {
            specification = specification.and(minIndexSpecification("T", filteringDTO.minIndexT()));
        }
        if (filteringDTO.minIndexS() != null) {
            specification = specification.and(minIndexSpecification("S", filteringDTO.minIndexS()));
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

            return criteriaBuilder.and(groupPredicate, criteriaBuilder.or(valuePredicates));
        };
    }

    public static Specification<Product> hasAllNutritionalValues2(List<String> values, String groupName, String namePrefix) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Avoid duplicate results

            // Subquery to filter products by matching vitamin count
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Product> subRoot = subquery.from(Product.class);
            Join<Product, NutritionalValue> subNutritionalValues = subRoot.join("nutritionalValues", JoinType.INNER);
            Join<NutritionalValue, NutritionalValueName> subNameJoin = subNutritionalValues.join("nutritionalValueName", JoinType.INNER);
            Join<NutritionalValueName, NutritionalValueGroup> subGroupJoin = subNameJoin.join("group", JoinType.INNER);
            subquery.select(criteriaBuilder.countDistinct(subNameJoin.get("name")))
                    .where(
                            criteriaBuilder.and(
                                    criteriaBuilder.equal(subGroupJoin.get("groupName"), groupName),
                                    subNameJoin.get("name").in(values.stream().map(value -> namePrefix + value).toArray()),
                                    criteriaBuilder.equal(subRoot, root) // Link subquery to main query
                            )
                    );

            // Ensure the count matches the size of the vitamin list
            return criteriaBuilder.equal(subquery, values.size());
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
            SetJoin<Product, ProductIndex> productIndexJoin = root.joinSet("productIndexes", JoinType.INNER);
            Predicate lessThanPredicate = criteriaBuilder.greaterThanOrEqualTo(
                    productIndexJoin.get("indexValue"),
                    value
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    productIndexJoin.get("indexName"),
                    indexName
            );
            return criteriaBuilder.and(lessThanPredicate, namePredicate);
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
            query.distinct(true); // Ensure no duplicates

            // Joins
            Join<Product, NutritionalValue> nutritionalValuesJoin = root.join("nutritionalValues", JoinType.INNER);
            Join<NutritionalValue, NutritionalValueName> nameJoin = nutritionalValuesJoin.join("nutritionalValueName", JoinType.INNER);
            Join<NutritionalValueName, NutritionalValueGroup> groupJoin = nameJoin.join("group", JoinType.INNER);

            // Predicates
            Predicate lessThanPredicate = criteriaBuilder.greaterThanOrEqualTo(
                    criteriaBuilder.coalesce(nutritionalValuesJoin.get("quantity"), 0.0), // Handle nulls
                    quantity
            );
            Predicate groupNamePredicate = criteriaBuilder.equal(
                    groupJoin.get("groupName"),
                    groupName
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    nameJoin.get("name"),
                    nutritionalValueName
            );
            // Combine Predicates
            return criteriaBuilder.and(lessThanPredicate, groupNamePredicate, namePredicate);
        };
    }


    static Specification<Product> maxSpecification(String nutritionalValueName, String groupName, Double quantity) {
        return (root, query, criteriaBuilder) -> {
            Join<Product, NutritionalValue> nutritionalValuesJoin = root.join("nutritionalValues", JoinType.INNER);

            Join<NutritionalValue, NutritionalValueName> nameJoin = nutritionalValuesJoin.join("nutritionalValueName", JoinType.INNER);

            Join<NutritionalValueName, NutritionalValueGroup> groupJoin = nameJoin.join("group", JoinType.INNER);

            Predicate lessThanPredicate = criteriaBuilder.lessThanOrEqualTo(
                    nutritionalValuesJoin.get("quantity"),
                    quantity
            );
            Predicate groupNamePredicate = criteriaBuilder.equal(
                    groupJoin.get("groupName"),
                    groupName
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    nameJoin.get("name"),
                    nutritionalValueName
            );
            return criteriaBuilder.and(lessThanPredicate, groupNamePredicate, namePredicate);
        };
    }

    public static Specification<Product> maxSpecification2(String nutritionalValueName, String groupName, Double quantity) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // Ensure no duplicates

            // Joins
            Join<Product, NutritionalValue> nutritionalValuesJoin = root.join("nutritionalValues", JoinType.INNER);
            Join<NutritionalValue, NutritionalValueName> nameJoin = nutritionalValuesJoin.join("nutritionalValueName", JoinType.INNER);
            Join<NutritionalValueName, NutritionalValueGroup> groupJoin = nameJoin.join("group", JoinType.INNER);

            // Predicates
            Predicate lessThanPredicate = criteriaBuilder.lessThanOrEqualTo(
                    criteriaBuilder.coalesce(nutritionalValuesJoin.get("quantity"), 0.0), // Handle nulls
                    quantity
            );
            Predicate groupNamePredicate = criteriaBuilder.equal(
                    groupJoin.get("groupName"),
                    groupName
            );
            Predicate namePredicate = criteriaBuilder.equal(
                    nameJoin.get("name"),
                    nutritionalValueName
            );
            // Combine Predicates
            return criteriaBuilder.and(lessThanPredicate, groupNamePredicate, namePredicate);
        };
    }
}
