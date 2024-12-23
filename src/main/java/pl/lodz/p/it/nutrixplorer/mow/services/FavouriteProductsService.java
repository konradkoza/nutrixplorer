package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.ProductAlreadyFavourite;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.codes.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.ErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.ProductRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
@Slf4j
public class FavouriteProductsService {


    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;


    public List<Product> getFavoriteProducts(UUID id) throws NotFoundException {
        return productRepository.findFavoriteProductsByUserId(id);
    }

    public void addProductToFavourites(UUID id, UUID productId) throws NotFoundException, ProductAlreadyFavourite {
        Product product = productRepository.findById(productId).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND));
        Client client = clientRepository.findByUserId(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.CLIENT_NOT_FOUND, MokErrorCodes.CLIENT_NOT_FOUND));
        if (!client.getFavouriteProducts().add(product)) {
            throw new ProductAlreadyFavourite(ErrorMessages.FAVOURITE_PRODUCT_ALREADY_EXISTS, MowErrorCodes.FAVOURITE_PRODUCT_ALREADY_EXISTS);
        }
        clientRepository.save(client);
    }

    public void removeProductFromFavourites(UUID id, UUID productId) throws NotFoundException {
        Product product = productRepository.findById(productId).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND));
        Client client = clientRepository.findByUserId(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.CLIENT_NOT_FOUND, MokErrorCodes.CLIENT_NOT_FOUND));
        if (!client.getFavouriteProducts().remove(product)) {
            throw new NotFoundException(ErrorMessages.FAVOURITE_PRODUCT_NOT_FOUND, MowErrorCodes.FAVOURITE_PRODUCT_NOT_FOUND);
        }
        clientRepository.save(client);
    }

    public Page<Product> getFavoriteProducts(UUID id, int page, int elements) {
        return productRepository.findFavoriteProductsByUserId(id, PageRequest.of(page, elements));
    }
}
