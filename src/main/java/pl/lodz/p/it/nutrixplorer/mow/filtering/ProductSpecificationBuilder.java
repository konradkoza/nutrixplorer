package pl.lodz.p.it.nutrixplorer.mow.filtering;

import org.springframework.data.jpa.domain.Specification;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecificationBuilder implements SpecificationBuilder<Product> {
    private final List<SearchCriteria> params;

    public ProductSpecificationBuilder() {
        params = new ArrayList<>();
    }

    public final ProductSpecificationBuilder with(String key, SearchOperation operation, Object value) {
        params.add(new SearchCriteria(key, operation, value));
        return this;
    }

    public final ProductSpecificationBuilder with(SearchCriteria searchCriteria) {
        params.add(searchCriteria);
        return this;
    }

    @Override
    public ProductSpecificationBuilder with(List<SearchCriteria> searchCriteria) {
        params.addAll(searchCriteria);
        return this;
    }

    public Specification<Product> build() {
        if (params.isEmpty()) {
            return null;
        }
        Specification<Product> result = new BasicSpecification<>(params.get(0));
        for (int i = 1; i < params.size(); i++) {
            result = result.and(new BasicSpecification<>(params.get(i)));
        }
        return result;
    }
}