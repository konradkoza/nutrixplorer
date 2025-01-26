package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.MowErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.repositories.ProductRepository;
import pl.lodz.p.it.nutrixplorer.utils.ProductSpecificationUtil;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED, transactionManager = "mowTransactionManager")
@LoggingInterceptor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> getAllProductsFiltered(int elements, int page, ProductsFilteringDTO filters) {
        Specification<Product> specification = ProductSpecificationUtil.createSpecification(filters);
        PageRequest pageRequest = PageRequest.of(page, elements);
        return productRepository.findAll(specification, pageRequest);
    }

    public byte[] getProductImage(UUID id) {
        return productRepository.findProductImageById(id).orElse(null);
    }

    public Product getProduct(UUID id) throws NotFoundException {
        return productRepository.findById(id).orElseThrow(() -> new NotFoundException(MowErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND));
    }

    public List<PackageType> getPackageTypes() {
        return productRepository.findDistinctPackageTypes();
    }

    public List<Allergen> getAllAllergens() {
        return productRepository.findAllAllergens();
    }

    public List<String> getCountries() {
        return productRepository.findAllCountries();
    }

    public List<String> getProductMatchingProductNames(int elements, String productName) {
        return productRepository.findProductByProductNameContaining(productName.toLowerCase(), PageRequest.of(0, elements)).getContent().stream().map(Product::getProductName).toList();
    }
}
