package pl.lodz.p.it.nutrixplorer.utils;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;
import pl.lodz.p.it.nutrixplorer.model.mok.AccessLevel;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.mok.dto.UsersFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.filtering.ProductSpecificationBuilder;
import pl.lodz.p.it.nutrixplorer.mow.filtering.SearchOperation;
import pl.lodz.p.it.nutrixplorer.mow.filtering.SpecificationBuilderImpl;

public class UserSpecificationUtil {

    public static Specification<User> createSpecification(UsersFilteringDTO filteringDTO) {
        SpecificationBuilderImpl<User> builder = new SpecificationBuilderImpl<>();
        if (filteringDTO == null) {
            return null;
        }
        if (filteringDTO.firstName() != null) {
            builder.with("firstName", SearchOperation.CONTAINS, filteringDTO.firstName());
        }
        if (filteringDTO.lastName() != null) {
            builder.with("lastName", SearchOperation.CONTAINS, filteringDTO.lastName());
        }
        if (filteringDTO.email() != null) {
            builder.with("email", SearchOperation.CONTAINS, filteringDTO.email());
        }
        Specification<User> specification = builder.build();

        if (filteringDTO.accessLevel() != null) {
            if (specification == null) {
                specification = accessLevelSpecification(filteringDTO.accessLevel());
            } else {
                specification = specification.and(accessLevelSpecification(filteringDTO.accessLevel()));
            }
        }
        return specification;
    }

    private static Specification<User> accessLevelSpecification(String accessLevel) {
        return ((root, query, criteriaBuilder) -> {
            if (accessLevel.equals("ADMINISTRATOR")) {
                Root<Administrator> administratorRoot = query.from(Administrator.class);
                return criteriaBuilder.equal(administratorRoot.get("user"), root);
            } else {
                Root<Client> clientRoot = query.from(Client.class);
                return criteriaBuilder.equal(clientRoot.get("user"), root);
            }

        });
    }
}
