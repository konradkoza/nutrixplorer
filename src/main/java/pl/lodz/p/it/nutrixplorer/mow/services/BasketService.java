package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.codes.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.ErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.model.mow.BasketEntry;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.BasketEntryRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.BasketRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.ProductRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class BasketService {
    private final BasketRepository basketRepository;
    private final BasketEntryRepository basketEntryRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;

    public Basket createBasket(List<BasketEntry> entries, String name, String description) throws NotFoundException {
        Basket basket = new Basket();
        basket.setBasketEntries(entries);
        basket.setName(name);
        basket.setDescription(description);
        UUID userId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        basket.setClient(clientRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException(ErrorMessages.USER_NOT_FOUND, MowErrorCodes.USER_NOT_FOUND)));
        basketRepository.saveAndFlush(basket);
        return basket;
    }

    public Basket addEntryToBasket(UUID basketId, UUID productId, BigDecimal quantity) throws NotFoundException {
        Basket basket = basketRepository.findById(basketId).orElseThrow(() -> new NotFoundException(ErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));
        BasketEntry entry = new BasketEntry();
        entry.setProduct(productRepository.findById(productId).orElseThrow(() -> new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND)));
        entry.setUnits(quantity);
        entry.setBasket(basket);
        basketEntryRepository.saveAndFlush(entry);
        return basket;
    }

    public void removeEntryFromBasket(UUID entryId) throws NotFoundException {
        BasketEntry basketEntry = getBasketEntry(entryId);
        UUID userId = basketEntry.getBasket().getClient().getUser().getId();
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        if (!userId.equals(currentUserId)) {
            throw new NotFoundException(ErrorMessages.BASKET_ENTRY_NOT_FOUND, MowErrorCodes.BASKET_ENTRY_NOT_FOUND);
        }
        basketEntryRepository.deleteById(entryId);
    }

    public List<Basket> getUserBaskets() throws NotFoundException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        return basketRepository.findAllByUserId(currentUserId);
    }

    public Basket getBasket(UUID basketId) throws NotFoundException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());

        Basket basket = basketRepository.findById(basketId).orElseThrow(() -> new NotFoundException(ErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));
        if (!basket.getClient().getUser().getId().equals(currentUserId)) {
            throw new NotFoundException(ErrorMessages.BASKET_ENTRY_NOT_FOUND, MowErrorCodes.BASKET_ENTRY_NOT_FOUND);
        }
        return basket;
    }

    public void removeBasket(UUID basketId) throws NotFoundException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Basket basket = basketRepository.findById(basketId).orElseThrow(() -> new NotFoundException(ErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));
        if (!basket.getClient().getUser().getId().equals(currentUserId)) {
            throw new NotFoundException(ErrorMessages.BASKET_ENTRY_NOT_FOUND, MowErrorCodes.BASKET_ENTRY_NOT_FOUND);
        } else {
            basketRepository.deleteById(basketId);
        }
    }

    public void updateEntry(UUID id, BigDecimal quantity) throws NotFoundException {
        BasketEntry basketEntry = getBasketEntry(id);
        basketEntry.setUnits(quantity);
        basketEntryRepository.saveAndFlush(basketEntry);
    }

    public List<NutritionalValueSummaryDTO> getNutritionalValues(UUID basketId) {
        return basketRepository.findSumOfNutritionalValuesByBasketId(basketId);
    }

    public List<String> getBasketAllergens(UUID basketId) {
        return basketRepository.findDistinctAllergensByBasketId(basketId);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    protected BasketEntry getBasketEntry(UUID entryId) throws NotFoundException {
        BasketEntry basketEntry = basketEntryRepository.findById(entryId).orElseThrow(() -> new NotFoundException(ErrorMessages.BASKET_ENTRY_NOT_FOUND, MowErrorCodes.BASKET_ENTRY_NOT_FOUND));
        UUID userId = basketEntry.getBasket().getClient().getUser().getId();
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        if (!userId.equals(currentUserId)) {
            throw new NotFoundException(ErrorMessages.BASKET_ENTRY_NOT_FOUND, MowErrorCodes.BASKET_ENTRY_NOT_FOUND);
        }
        return basketEntry;
    }
}
