package pl.lodz.p.it.nutrixplorer.utils;

import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketFilteringDTO;

import java.util.List;


@Slf4j
public class BasketSpecificationUtil {

    public static Specification<Basket> createSpecification(BasketFilteringDTO filteringDTO) {
        Specification<Basket> specification = Specification.where(null);
        if (filteringDTO == null) {
            return null;
        }
        if (filteringDTO.name() != null) {
            specification = specification.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + filteringDTO.name().toLowerCase() + "%"));
        }
        if (filteringDTO.vitamins() != null && !filteringDTO.vitamins().isEmpty()) {
            specification = specification.and(hasAllNutritionalValues2(filteringDTO.vitamins(), "Witaminy", "Witamina "));
        }
        if (filteringDTO.minerals() != null && !filteringDTO.minerals().isEmpty()) {
            specification = specification.and(hasAllNutritionalValues2(filteringDTO.minerals(), "Minerały", ""));
        }
        if (filteringDTO.minCarbs() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Total", "Węglowodany", Double.parseDouble(filteringDTO.minCarbs()), false));
        }
        if (filteringDTO.maxCarbs() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Total", "Węglowodany", Double.parseDouble((filteringDTO.maxCarbs())), true));
        }
        if (filteringDTO.minFat() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Total", "Tłuszcz", Double.parseDouble(filteringDTO.minFat()), false));
        }
        if (filteringDTO.maxFat() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Total", "Tłuszcz", Double.parseDouble((filteringDTO.maxFat())), true));
        }
        if (filteringDTO.minProtein() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Białko", "Białko", Double.parseDouble(filteringDTO.minProtein()), false));
        }
        if (filteringDTO.maxProtein() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Białko", "Białko", Double.parseDouble((filteringDTO.maxProtein())), true));
        }
        if (filteringDTO.minEnergy() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Wartość Energetyczna", "Wartość Energetyczna", Double.parseDouble(filteringDTO.minEnergy()), false));
        }
        if (filteringDTO.maxEnergy() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Wartość Energetyczna", "Wartość Energetyczna", Double.parseDouble(filteringDTO.maxEnergy()), true));
        }
        if (filteringDTO.minFiber() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Błonnik", "Błonnik", Double.parseDouble(filteringDTO.minFiber()), false));
        }
        if (filteringDTO.maxFiber() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Błonnik", "Błonnik", Double.parseDouble(filteringDTO.maxFiber()), true));
        }
        if (filteringDTO.minSalt() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Sól", "Sól", Double.parseDouble(filteringDTO.minSalt()), false));
        }
        if (filteringDTO.maxSalt() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Sól", "Sól", Double.parseDouble(filteringDTO.maxSalt()), true));
        }
        if (filteringDTO.minSugar() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Cukry", "Węglowodany", Double.parseDouble(filteringDTO.minSugar()), false));
        }
        if (filteringDTO.maxSugar() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Cukry", "Węglowodany", Double.parseDouble(filteringDTO.maxSugar()), true));
        }
        if (filteringDTO.minSaturatedFat() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Kwasy nasycone", "Tłuszcz", Double.parseDouble(filteringDTO.minSaturatedFat()), false));
        }
        if (filteringDTO.maxSaturatedFat() != null) {
            specification = specification.and(hasNutritionalValueSumLessThan("Kwasy nasycone", "Tłuszcz", Double.parseDouble(filteringDTO.maxSaturatedFat()), true));
        }
        if (filteringDTO.allergens() != null && !filteringDTO.allergens().isEmpty()) {
            specification = specification.and(hasNoAllergens(filteringDTO.allergens()));
        }
        return specification;

    }


    public static Specification<Basket> hasAllNutritionalValues2(List<String> values, String groupName, String namePrefix) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);


            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Basket> subRoot = subquery.from(Basket.class);
            Join<Product, NutritionalValue> subNutritionalValues = subRoot.join("basketEntries").join("product").join("nutritionalValues", JoinType.INNER);
            Join<NutritionalValue, NutritionalValueName> subNameJoin = subNutritionalValues.join("nutritionalValueName", JoinType.INNER);
            Join<NutritionalValueName, NutritionalValueGroup> subGroupJoin = subNameJoin.join("group", JoinType.INNER);
            subquery.select(criteriaBuilder.countDistinct(subNameJoin.get("name")))
                    .where(
                            criteriaBuilder.and(
                                    criteriaBuilder.equal(subGroupJoin.get("groupName"), groupName),
                                    subNameJoin.get("name").in(values.stream().map(value -> namePrefix + value).toArray()),
                                    criteriaBuilder.equal(subRoot, root)
                            )
                    );


            return criteriaBuilder.equal(subquery, values.size());
        };
    }

    public static Specification<Basket> hasNoAllergens(List<String> allergens) {
        return (root, query, criteriaBuilder) -> {
            Join<Product, Label> labelJoin = root.join("basketEntries").join("product").join("label", JoinType.INNER);
            Join<Label, Allergen> nameJoin = labelJoin.join("allergenList", JoinType.INNER);

            if (query != null) {
                query.distinct(true);
            }

            Predicate[] valuePredicates = allergens.stream()
                    .map(value -> criteriaBuilder.notEqual(nameJoin.get("name"), value))
                    .toArray(Predicate[]::new);

            return criteriaBuilder.and(valuePredicates);
        };
    }




    public static Specification<Basket> hasNutritionalValueSumLessThan(
            String name,
            String groupName,
            Double maxValue,
            Boolean isLessThan
    ) {
        return (root, query, criteriaBuilder) -> {
            Subquery<Double> subquery = query.subquery(Double.class);
            Root<BasketEntry> basketEntryRoot = subquery.from(BasketEntry.class);

            Join<BasketEntry, Product> productJoin = basketEntryRoot.join("product", JoinType.INNER);
            Join<Product, NutritionalValue> nutritionalValueJoin = productJoin.join("nutritionalValues", JoinType.INNER);
            Join<NutritionalValue, NutritionalValueName> nameJoin = nutritionalValueJoin.join("nutritionalValueName", JoinType.INNER);
            Join<NutritionalValueName, NutritionalValueGroup> groupJoin = nameJoin.join("group", JoinType.INNER);

            Predicate basketPredicate = criteriaBuilder.equal(basketEntryRoot.get("basket"), root);
            Predicate namePredicate = criteriaBuilder.equal(nameJoin.get("name"), name);
            Predicate groupPredicate = criteriaBuilder.equal(groupJoin.get("groupName"), groupName);

            Expression<Object> quantityExpression = criteriaBuilder.selectCase()
                    .when(
                            criteriaBuilder.equal(productJoin.get("unit").get("name"), "l"),
                            criteriaBuilder.prod(
                                    criteriaBuilder.prod(
                                            criteriaBuilder.toDouble(basketEntryRoot.get("units")),
                                            criteriaBuilder.literal(1000.0)
                                    ),
                                    criteriaBuilder.quot(
                                            criteriaBuilder.toDouble(nutritionalValueJoin.get("quantity")),
                                            criteriaBuilder.literal(100.0)
                                    )
                            )
                    )
                    .otherwise(
                            criteriaBuilder.prod(
                                    criteriaBuilder.toDouble(basketEntryRoot.get("units")),
                                    criteriaBuilder.quot(
                                            criteriaBuilder.toDouble(nutritionalValueJoin.get("quantity")),
                                            criteriaBuilder.literal(100.0)
                                    )
                            )
                    );

            subquery.select(criteriaBuilder.coalesce(criteriaBuilder.sum(quantityExpression.as(Double.class)), 0.0))
                    .where(criteriaBuilder.and(basketPredicate, namePredicate, groupPredicate));

            if (isLessThan) {
                return criteriaBuilder.lessThanOrEqualTo(subquery.as(Double.class), maxValue);
            } else {
                return criteriaBuilder.greaterThanOrEqualTo(subquery.as(Double.class), maxValue);
            }
        };
    }

}
