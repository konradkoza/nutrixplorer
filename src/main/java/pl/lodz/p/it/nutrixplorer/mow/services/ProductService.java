package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.codes.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.ErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.repositories.ProductRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
@LoggingInterceptor
public class ProductService {

    private final ProductRepository productRepository;
    private final List<String> simpleNutritionalValues = List.of("Wartość Energetyczna", "Total", "Kwasy nasycone", "Białko", "Sól", "Cukry", "Tłuszcz");

    public Page<Product> getAllProducts(int elements, int page) {
        PageRequest pageRequest = PageRequest.of(page, elements);
        return productRepository.findAll(pageRequest);
    }

    public Page<Product> getAllProductsFiltered(int elements, int page, Specification<Product> specification) {
        PageRequest pageRequest = PageRequest.of(page, elements);
        return productRepository.findAll(specification, pageRequest);
    }

    public byte[] getProductImage(UUID id) throws NotFoundException {
        return productRepository.findProductImageById(id).orElse(null);
    }

    public Product getProduct(UUID id) throws NotFoundException {
        return productRepository.findById(id).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND));
    }

    public Producer getProductProducer(UUID id) throws NotFoundException {
        return productRepository.findProducerByProductId(id).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_PRODUCER_NOT_FOUND, MowErrorCodes.PRODUCT_PRODUCER_NOT_FOUND));
    }

    public Composition getProductComposition(UUID id) throws NotFoundException {
        return productRepository.findCompositionByProductId(id).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_COMPOSITION_NOT_FOUND, MowErrorCodes.PRODUCT_COMPOSITION_NOT_FOUND));
    }

    public List<Rating> getProductRating(UUID id) {
        return productRepository.findRatingsByProductId(id);
    }

    public List<NutritionalValue> getSimpleNutritionTable(UUID id) throws NotFoundException {
        Product product = productRepository.findById(id).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND));
        List<NutritionalValue> nutritionalValues = product.getNutritionalValues();

        return nutritionalValues.stream()
                .filter(nutritionalValue -> simpleNutritionalValues.contains(nutritionalValue.getNutritionalValueName().getName()))
                .toList();
    }

    public List<NutritionalValue> getNutritionTable(UUID id) throws NotFoundException {
        return productRepository.findNutritionalValuesByProductId(id);
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
