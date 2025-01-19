package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.ProductAlreadyFavourite;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.codes.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.MowErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.mow.repositories.MowClientRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.ProductRepository;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED, transactionManager = "mowTransactionManager")
@Slf4j
@LoggingInterceptor
public class FavouriteProductsService {


    private final MowClientRepository clientRepository;
    private final ProductRepository productRepository;


    public List<Product> getCurrentUserFavoriteProducts() {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        return productRepository.findFavoriteProductsByUserId(id);
    }

    public void addProductToFavourites(UUID productId) throws NotFoundException, ProductAlreadyFavourite {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Product product = productRepository.findById(productId).orElseThrow(() -> new NotFoundException(MowErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND));
        Client client = clientRepository.findByUserId(id).orElseThrow(() -> new NotFoundException(MowErrorMessages.CLIENT_NOT_FOUND, MowErrorCodes.CLIENT_NOT_FOUND));
        if (productRepository.isProductFavoritedByUser(productId, id)) {
            throw new ProductAlreadyFavourite(MowErrorMessages.FAVOURITE_PRODUCT_ALREADY_EXISTS, MowErrorCodes.FAVOURITE_PRODUCT_ALREADY_EXISTS);
        }
        client.getFavouriteProducts().add(product);
        clientRepository.save(client);
    }

    public void removeProductFromFavourites(UUID productId) throws NotFoundException {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Product product = productRepository.findById(productId).orElseThrow(() -> new NotFoundException(MowErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND));
        Client client = clientRepository.findByUserId(id).orElseThrow(() -> new NotFoundException(MowErrorMessages.CLIENT_NOT_FOUND, MowErrorCodes.CLIENT_NOT_FOUND));
        if (!productRepository.isProductFavoritedByUser(productId, id)) {
            throw new NotFoundException(MowErrorMessages.FAVOURITE_PRODUCT_NOT_FOUND, MowErrorCodes.FAVOURITE_PRODUCT_NOT_FOUND);
        }
        client.getFavouriteProducts().remove(product);
        clientRepository.save(client);
    }

    public Page<Product> getCurrentUserFavoriteProducts(int page, int elements) {
        UUID id = UUID.fromString(SecurityContextUtil.getCurrentUser());
        return productRepository.findFavoriteProductsByUserId(id, PageRequest.of(page, elements));
    }
}
