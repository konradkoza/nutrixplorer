package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
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
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/favourites")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class FavouritesController {


    private final FavouriteProductsService favouriteProductsService;

    @GetMapping()
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ProductSimpleDTO>> getFavoriteProducts() throws NotFoundException {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        List<Product> products = favouriteProductsService.getFavoriteProducts(id);
        return ResponseEntity.ok(ProductMapper.INSTANCE.productsToProductSimpleDTOs(products));
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ProductsListDTO> getFavoriteProductsPage(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int elements) throws NotFoundException {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Page<Product> products = favouriteProductsService.getFavoriteProducts(id, page, elements);
        log.info("Total elements: {}", products.getTotalElements());
        log.info("Total pages: {}", products.getTotalPages());
        return ResponseEntity.ok(new ProductsListDTO(ProductMapper.INSTANCE.productsToProductSimpleDTOs(products.getContent()), products.getTotalPages()));
    }

    @PostMapping("/product/{productId}/add")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> addProductToFavourites(@PathVariable UUID productId) throws NotFoundException, ProductAlreadyFavourite {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        favouriteProductsService.addProductToFavourites(id, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/product/{productId}/remove")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> removeProductFromFavourites(@PathVariable UUID productId) throws NotFoundException {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        favouriteProductsService.removeProductFromFavourites(id, productId);
        return ResponseEntity.ok().build();
    }
}
