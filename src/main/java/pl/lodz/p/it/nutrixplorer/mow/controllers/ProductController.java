package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.mow.dto.NutritionalValueDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductDetailsDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsListDTO;
import pl.lodz.p.it.nutrixplorer.mow.mappers.ProductMapper;
import pl.lodz.p.it.nutrixplorer.mow.services.ProductService;
import pl.lodz.p.it.nutrixplorer.utils.SpecificationUtil;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/product")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class ProductController {
    private final ProductService productService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProductsListDTO> getProducts(@RequestParam(defaultValue = "10") int elements,
                                                       @RequestParam(defaultValue = "0") int page) {
        Page<Product> products = productService.getAllProducts(elements, page);
        return ResponseEntity.ok(new ProductsListDTO(ProductMapper.INSTANCE.productsToProductSimpleDTOs(products.getContent()), products.getTotalPages()));
    }

    @GetMapping("/filtered")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProductsListDTO> getFilteredProducts(@RequestParam(defaultValue = "10") int elements,
                                                               @RequestParam(defaultValue = "0") int page,
                                                               ProductsFilteringDTO filters) {
        Specification<Product> specification = SpecificationUtil.createSpecification(filters);
        Page<Product> products = productService.getAllProductsFiltered(elements, page, specification);
        return ResponseEntity.ok(new ProductsListDTO(ProductMapper.INSTANCE.productsToProductSimpleDTOs(products.getContent()), products.getTotalPages()));
    }

    @GetMapping("/{id}/image")
    @PreAuthorize("permitAll()")
    public ResponseEntity<byte[]> getProductImage(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(productService.getProductImage(id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProductDetailsDTO> getProductDetails(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(ProductMapper.INSTANCE.productToProductDetailsDTO(productService.getProduct(id)));
    }


    @GetMapping("/{id}/simple-nutrition")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<NutritionalValueDTO>> getProductNutritionTable(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(ProductMapper.INSTANCE.nutritionalValuesToNutritionalValueDTOs(productService.getSimpleNutritionTable(id)));
    }

    @GetMapping("/{id}/nutrition")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<NutritionalValueDTO>> getProductNutritionDetailsTable(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(ProductMapper.INSTANCE.nutritionalValuesToNutritionalValueDTOs(productService.getNutritionTable(id)));
    }

}
