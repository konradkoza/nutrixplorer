package pl.lodz.p.it.nutrixplorer.mow.filtering;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import pl.lodz.p.it.nutrixplorer.model.mow.NutritionalValue;
import pl.lodz.p.it.nutrixplorer.model.mow.NutritionalValueGroup;
import pl.lodz.p.it.nutrixplorer.model.mow.NutritionalValueName;

public class NestedSpecification<T> implements Specification<T> {
    private final SearchCriteria searchCriteria;

    public NestedSpecification(SearchCriteria searchCriteria) {
        this.searchCriteria = searchCriteria;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        String strToSearch = searchCriteria.getValue().toString().toLowerCase();
        Join<T, NutritionalValue> nutritionalValueJoin = root.join("nutritionalValues");
        Join<NutritionalValue, NutritionalValueName> nutritionalValueNameJoin = nutritionalValueJoin.join("nutritionalValueName");
        Join<NutritionalValueName, NutritionalValueGroup> nutritionalValueGroupJoin = nutritionalValueNameJoin.join("group");

        Predicate groupPredicate = criteriaBuilder.equal(nutritionalValueGroupJoin.get("name"), "Witaminy");
        Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(nutritionalValueNameJoin.get("name")), "%" + strToSearch + "%");

        return criteriaBuilder.and(groupPredicate, namePredicate);
    }
}
