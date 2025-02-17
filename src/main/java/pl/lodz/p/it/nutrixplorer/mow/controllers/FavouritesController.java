package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.ProductAlreadyFavourite;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductSimpleDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductsListDTO;
import pl.lodz.p.it.nutrixplorer.mow.mappers.ProductMapper;
import pl.lodz.p.it.nutrixplorer.mow.services.FavouriteProductsService;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/favourites")
@Transactional(propagation = Propagation.NEVER, transactionManager = "mowTransactionManager")
public class FavouritesController {


    private final FavouriteProductsService favouriteProductsService;

    @GetMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ProductSimpleDTO>> getFavoriteProducts() {
        List<Product> products = favouriteProductsService.getCurrentUserFavoriteProducts();
        return ResponseEntity.ok(ProductMapper.INSTANCE.productsToProductSimpleDTOs(products));
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ProductsListDTO> getFavoriteProductsPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int elements) {
        Page<Product> products = favouriteProductsService.getCurrentUserFavoriteProducts(page, elements);
        return ResponseEntity.ok(new ProductsListDTO(ProductMapper.INSTANCE.productsToProductSimpleDTOs(products.getContent()), products.getTotalPages()));
    }

    @PostMapping("/product/{productId}/add")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> addProductToFavourites(@PathVariable UUID productId) throws NotFoundException, ProductAlreadyFavourite {
        favouriteProductsService.addProductToFavourites(productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/product/{productId}/remove")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> removeProductFromFavourites(@PathVariable UUID productId) throws NotFoundException {
        favouriteProductsService.removeProductFromFavourites(productId);
        return ResponseEntity.ok().build();
    }
}
