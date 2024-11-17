package pl.lodz.p.it.nutrixplorer.mow.filtering;

import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface SpecificationBuilder<T> {
    SpecificationBuilder<T> with(String key, SearchOperation operation, Object value);

    SpecificationBuilder<T> with(SearchCriteria searchCriteria);

    SpecificationBuilder<T> with(List<SearchCriteria> searchCriteria);

    Specification<T> build();
}