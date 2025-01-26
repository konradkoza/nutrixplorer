package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.BasketEntryException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.BasketNameNotUniqueException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.MowErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.model.mow.BasketEntry;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketEntryDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.CreateBasketDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.UpdateEntryDTO;
import pl.lodz.p.it.nutrixplorer.mow.repositories.BasketEntryRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.BasketRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.MowClientRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.ProductRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO;
import pl.lodz.p.it.nutrixplorer.utils.BasketSpecificationUtil;
import pl.lodz.p.it.nutrixplorer.utils.ETagSigner;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(
        propagation = Propagation.REQUIRES_NEW,
        isolation = Isolation.READ_COMMITTED,
        rollbackFor = BaseWebException.class,
        transactionManager = "mowTransactionManager")
@LoggingInterceptor
public class BasketService {
    private final BasketRepository basketRepository;
    private final BasketEntryRepository basketEntryRepository;
    private final ProductRepository productRepository;
    private final MowClientRepository clientRepository;
    private final ETagSigner verifier;

    public Basket createBasket(CreateBasketDTO createBasketDTO) throws NotFoundException, BasketNameNotUniqueException {
        Basket basket = new Basket();
        basket.setName(createBasketDTO.name());
        basket.setDescription(createBasketDTO.description());
        UUID userId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        basket.setClient(clientRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException(MowErrorMessages.USER_NOT_FOUND, MowErrorCodes.USER_NOT_FOUND)));
        try {
            basketRepository.saveAndFlush(basket);
        } catch (JpaSystemException e) {
            throw new BasketNameNotUniqueException(MowErrorMessages.BASKET_NAME_NOT_UNIQUE, MowErrorCodes.BASKET_NAME_NOT_UNIQUE, e);
        }
        return basket;
    }

    public Basket addEntryToBasket(UUID basketId, BasketEntryDTO entryDTO) throws NotFoundException, BasketEntryException {
        if (entryDTO.quantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BasketEntryException(MowErrorMessages.INVALID_QUANTITY, MowErrorCodes.INVALID_QUANTITY);
        }
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Basket basket = basketRepository.findByIdAndUserId(basketId, currentUserId).orElseThrow(() -> new NotFoundException(MowErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));

        BasketEntry entry = new BasketEntry();
        entry.setProduct(productRepository.findById(entryDTO.productId()).orElseThrow(() -> new NotFoundException(MowErrorMessages.PRODUCT_NOT_FOUND, MowErrorCodes.PRODUCT_NOT_FOUND)));
        entry.setUnits(entryDTO.quantity());
        entry.setBasket(basket);
        try {
            basketEntryRepository.saveAndFlush(entry);
        } catch (JpaSystemException e) {
            throw new BasketEntryException(MowErrorMessages.PRODUCT_ALREADY_IN_BASKET, MowErrorCodes.PRODUCT_ALREADY_IN_BASKET, e);
        }
        return basket;
    }

    public void removeEntryFromBasket(UUID entryId) throws NotFoundException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        BasketEntry basketEntry = basketEntryRepository.findByIdAndUser(entryId, currentUserId).orElseThrow(() -> new NotFoundException(MowErrorMessages.BASKET_ENTRY_NOT_FOUND, MowErrorCodes.BASKET_ENTRY_NOT_FOUND));
        basketEntryRepository.removeBasketEntryById(basketEntry.getId());

    }

    public List<Basket> getUserBaskets() {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        return basketRepository.findAllByUserId(currentUserId);
    }

    public List<Basket> getUserBasketsByName(String name) {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Specification<Basket> specification = Specification.where((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("client").get("user").get("id"), currentUserId));
        specification = specification.and((root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        return basketRepository.findAll(specification, PageRequest.of(0, 5)).getContent();
    }

    public Basket getBasket(UUID basketId) throws NotFoundException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        return basketRepository.findByIdAndUserId(basketId, currentUserId).orElseThrow(() -> new NotFoundException(MowErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));
    }

    public void removeBasket(UUID basketId) throws NotFoundException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Basket basket = basketRepository.findByIdAndUserId(basketId, currentUserId).orElseThrow(() -> new NotFoundException(MowErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));
        basketRepository.delete(basket);
    }

    public void updateEntry(UUID id, UpdateEntryDTO entryDTO) throws NotFoundException, BasketEntryException {
        if (entryDTO.quantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BasketEntryException(MowErrorMessages.INVALID_QUANTITY, MowErrorCodes.INVALID_QUANTITY);
        }
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        BasketEntry basketEntry = basketEntryRepository.findByIdAndUser(id, currentUserId).orElseThrow(() -> new NotFoundException(MowErrorMessages.BASKET_ENTRY_NOT_FOUND, MowErrorCodes.BASKET_ENTRY_NOT_FOUND));
        basketEntry.setUnits(entryDTO.quantity());
        basketEntryRepository.saveAndFlush(basketEntry);

    }

    public List<NutritionalValueSummaryDTO> getNutritionalValues(UUID basketId) {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        return basketRepository.findSumOfNutritionalValuesByBasketIdAndUserId(basketId, currentUserId);
    }

    public List<String> getBasketAllergens(UUID basketId) {
        return basketRepository.findDistinctAllergensByBasketId(basketId);
    }


    public void updateBasket(UUID basketId, CreateBasketDTO basketDTO, String tagValue) throws NotFoundException, ApplicationOptimisticLockException, InvalidHeaderException, BasketNameNotUniqueException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Basket basket = basketRepository.findByIdAndUserId(basketId, currentUserId).orElseThrow(() -> new NotFoundException(MowErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));
        if (!verifier.verifySignature(basket.getId(), basket.getVersion(), tagValue)) {
            throw new ApplicationOptimisticLockException(ExceptionMessages.OPTIMISTIC_LOCK, ErrorCodes.OPTIMISTIC_LOCK);
        }
        basket.setName(basketDTO.name());
        basket.setDescription(basketDTO.description());
        try {
            basketRepository.saveAndFlush(basket);
        } catch (JpaSystemException e) {
            throw new BasketNameNotUniqueException(MowErrorMessages.BASKET_NAME_NOT_UNIQUE, MowErrorCodes.BASKET_NAME_NOT_UNIQUE, e);
        }

    }

    public Basket cloneBasket(UUID basketId, CreateBasketDTO basketDTO) throws NotFoundException, BasketNameNotUniqueException {
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Basket basket = basketRepository.findByIdAndUserId(basketId, currentUserId).orElseThrow(() -> new NotFoundException(MowErrorMessages.BASKET_NOT_FOUND, MowErrorCodes.BASKET_NOT_FOUND));
        Basket newBasket = new Basket();
        newBasket.setClient(basket.getClient());
        newBasket.setName(basketDTO.name());
        newBasket.setDescription(basketDTO.description());
        List<BasketEntry> newEntries = basket.getBasketEntries().stream().map(
                (entry) -> new BasketEntry(entry.getProduct(), entry.getUnits(), newBasket)
        ).toList();
        newBasket.setBasketEntries(newEntries);

        try {
            return basketRepository.saveAndFlush(newBasket);
        } catch (JpaSystemException e) {
            throw new BasketNameNotUniqueException(MowErrorMessages.BASKET_NAME_NOT_UNIQUE, MowErrorCodes.BASKET_NAME_NOT_UNIQUE, e);
        }
    }

    public Page<Basket> getFilteredBaskets(int elements, int page, BasketFilteringDTO filters) {
        Specification<Basket> specification = BasketSpecificationUtil.createSpecification(filters);
        PageRequest pageRequest = PageRequest.of(page, elements);
        UUID currentUserId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        if (specification == null) {
            return basketRepository.findAllByUserId(currentUserId, pageRequest);
        }
        specification = specification.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("client").get("user").get("id"), currentUserId));
        return basketRepository.findAll(specification, pageRequest);
    }
}
