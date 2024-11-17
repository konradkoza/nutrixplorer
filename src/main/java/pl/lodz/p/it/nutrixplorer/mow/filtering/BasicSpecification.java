package pl.lodz.p.it.nutrixplorer.mow.filtering;


import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.Objects;

public class BasicSpecification<T> implements Specification<T> {
    private final SearchCriteria searchCriteria;

    public BasicSpecification(SearchCriteria searchCriteria) {
        this.searchCriteria = searchCriteria;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        String strToSearch = searchCriteria.getValue().toString().toLowerCase();
        return switch (Objects.requireNonNull((searchCriteria.getOperation()))) {
            case CONTAINS -> cb.like(cb.lower(root.get(searchCriteria.getFilterKeys().getFirst())), "%" + strToSearch + "%");
            case DOES_NOT_CONTAIN -> cb.notLike(cb.lower(root.get(searchCriteria.getFilterKeys().getFirst())), "%" + strToSearch + "%");
            case BEGINS_WITH -> cb.like(cb.lower(root.get(searchCriteria.getFilterKeys().getFirst())), strToSearch + "%");
            case DOES_NOT_BEGIN_WITH -> cb.notLike(cb.lower(root.get(searchCriteria.getFilterKeys().getFirst())), strToSearch + "%");
            case ENDS_WITH -> cb.like(cb.lower(root.get(searchCriteria.getFilterKeys().getFirst())), "%" + strToSearch);
            case DOES_NOT_END_WITH -> cb.notLike(cb.lower(root.get(searchCriteria.getFilterKeys().getFirst())), "%" + strToSearch);
            case EQUAL -> cb.equal(root.get(searchCriteria.getFilterKeys().getFirst()), searchCriteria.getValue());
            case NOT_EQUAL -> cb.notEqual(root.get(searchCriteria.getFilterKeys().getFirst()), searchCriteria.getValue());
            case NUL -> cb.isNull(root.get(searchCriteria.getFilterKeys().getFirst()));
            case NOT_NULL -> cb.isNotNull(root.get(searchCriteria.getFilterKeys().getFirst()));
            case GREATER_THAN -> cb.greaterThan(root.get(searchCriteria.getFilterKeys().getFirst()), searchCriteria.getValue().toString());
            case GREATER_THAN_EQUAL -> cb.greaterThanOrEqualTo(root.get(searchCriteria.getFilterKeys().getFirst()), searchCriteria.getValue().toString());
            case LESS_THAN -> cb.lessThan(root.get(searchCriteria.getFilterKeys().getFirst()), searchCriteria.getValue().toString());
            case LESS_THAN_EQUAL -> cb.lessThanOrEqualTo(root.get(searchCriteria.getFilterKeys().getFirst()), searchCriteria.getValue().toString());
            default -> null;
        };
    }
}