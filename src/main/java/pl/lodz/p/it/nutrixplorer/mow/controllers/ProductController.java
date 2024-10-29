package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
import pl.lodz.p.it.nutrixplorer.mow.dto.*;
import pl.lodz.p.it.nutrixplorer.mow.mappers.ProductMapper;
import pl.lodz.p.it.nutrixplorer.mow.services.ProductService;

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
                                                       @RequestParam( defaultValue = "0") int page) {
        Page<Product> products = productService.getAllProducts(elements, page);
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

    @GetMapping("/{id}/producer")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProducerDTO> getProductProducerDetails(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(ProductMapper.INSTANCE.producerToProducerDTO(productService.getProductProducer(id)));
    }

    @GetMapping("/{id}/composition")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProductCompositionDTO> getProductComposition(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(ProductMapper.INSTANCE.compositionToCompositionDTO(productService.getProductComposition(id)));
    }

    @GetMapping("/{id}/rating")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<ProductRatingDTO>> getProductRating(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(ProductMapper.INSTANCE.ratingsToRatingDTOs(productService.getProductRating(id)));
    }

}
