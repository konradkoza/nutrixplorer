package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.codes.ErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.ErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.mow.repositories.ProductRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class ProductService {

    private final ProductRepository productRepository;


    public Page<Product> getAllProducts(int elements, int page) {
        PageRequest pageRequest = PageRequest.of(page, elements);
        return productRepository.findAll(pageRequest);
    }

    public byte[] getProductImage(UUID id) throws NotFoundException {
        return productRepository.findProductImageById(id).orElse(null);
    }

    public Product getProduct(UUID id) throws NotFoundException {
        return productRepository.findById(id).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND, ErrorCodes.PRODUCT_NOT_FOUND));
    }
}
