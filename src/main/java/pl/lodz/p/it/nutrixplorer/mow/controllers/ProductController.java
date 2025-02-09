package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductDetailsDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsListDTO;
import pl.lodz.p.it.nutrixplorer.mow.mappers.ProductMapper;
import pl.lodz.p.it.nutrixplorer.mow.services.ProductService;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/product")
@Transactional(propagation = Propagation.NEVER, transactionManager = "mowTransactionManager")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProductsListDTO> getFilteredProducts(@RequestParam(defaultValue = "10") int elements,
                                                               @RequestParam(defaultValue = "0") int page,
                                                               ProductsFilteringDTO filters) {
        Page<Product> products = productService.getAllProductsFiltered(elements, page, filters);
        return ResponseEntity.ok(new ProductsListDTO(ProductMapper.INSTANCE.productsToProductSimpleDTOs(products.getContent()), products.getTotalPages()));
    }

    @GetMapping("/name")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<String>> getFilteredProducts(@RequestParam(defaultValue = "5") int elements,
                                                            @RequestParam(defaultValue = "") String productName) {
        List<String> products = productService.getProductMatchingProductNames(elements, productName);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}/image")
    @PreAuthorize("permitAll()")
    public ResponseEntity<byte[]> getProductImage(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductImage(id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProductDetailsDTO> getProductDetails(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(ProductMapper.INSTANCE.productToProductDetailsDTO(productService.getProduct(id)));
    }


    @GetMapping("/package-types")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<String>> getPackageTypes() {
        return ResponseEntity.ok(ProductMapper.INSTANCE.packageTypesToStrings(productService.getPackageTypes()));
    }

    @GetMapping("/allergens")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<String>> getAllAllergens() {
        return ResponseEntity.ok(ProductMapper.INSTANCE.allergensToStrings(productService.getAllAllergens()));
    }

    @GetMapping("/countries")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<String>> getCountries() {
        return ResponseEntity.ok(productService.getCountries());
    }

}
