package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.BasketEntryException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.BasketNameNotUniqueException;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.mow.dto.*;
import pl.lodz.p.it.nutrixplorer.mow.mappers.BasketMapper;
import pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO;
import pl.lodz.p.it.nutrixplorer.mow.services.BasketService;
import pl.lodz.p.it.nutrixplorer.utils.BasketSpecificationUtil;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/basket")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class BasketController {

    private final BasketService basketService;

    @GetMapping("/user")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BasketDTO>> getUserBaskets() throws NotFoundException {
        return ResponseEntity.ok(BasketMapper.INSTANCE.basketsToBasketDTOs(basketService.getUserBaskets()));
    }

    @GetMapping("/user/list")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BasketSimpleDTO>> getUserBasketsList() throws NotFoundException {
        return ResponseEntity.ok(BasketMapper.INSTANCE.basketsToBasketSimpleDTOs(basketService.getUserBaskets()));
    }

    @GetMapping("/user/list/filtered")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BasketSimpleDTO>> getUserBasketsList(@RequestParam(defaultValue = "") String name) throws NotFoundException {
        return ResponseEntity.ok(BasketMapper.INSTANCE.basketsToBasketSimpleDTOs(basketService.getUserBasketsByName(name)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> getBasket(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(BasketMapper.INSTANCE.basketToBasketDTO(basketService.getBasket(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketSimpleDTO> createBasket(@RequestBody CreateBasketDTO createBasketDTO) throws NotFoundException, BasketNameNotUniqueException {
        Basket basket = basketService.createBasket(BasketMapper.INSTANCE.basketEntryDTOsToBasketEntries(createBasketDTO.basketEntries()), createBasketDTO.name(), createBasketDTO.description());
        return ResponseEntity.status(HttpStatus.CREATED).body(BasketMapper.INSTANCE.basketToBasketSimpleDTO(basket));
    }

    @PostMapping("/{basketId}/entry")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> addEntryToBasket(@PathVariable UUID basketId, @RequestBody BasketEntryDTO entryDTO) throws NotFoundException, BasketEntryException {
        Basket basket = basketService.addEntryToBasket(basketId, entryDTO.productId(), entryDTO.quantity());
        return ResponseEntity.ok(BasketMapper.INSTANCE.basketToBasketDTO(basket));
    }

    @DeleteMapping("/entry/{entryId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> removeEntryFromBasket(@PathVariable UUID entryId) throws NotFoundException {
        basketService.removeEntryFromBasket(entryId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{basketId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> removeBasket(@PathVariable UUID basketId) throws NotFoundException {
        basketService.removeBasket(basketId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/entry/{entryId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> updateBasketEntry(@RequestBody UpdateEntryDTO entryDTO, @PathVariable UUID entryId) throws NotFoundException {
        basketService.updateEntry(entryId, entryDTO.quantity());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{basketId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> updateBasket(@RequestBody UpdateBasketDTO updateBasketDTO, @PathVariable UUID basketId) throws NotFoundException {
        basketService.updateBasket(basketId, updateBasketDTO.name(), updateBasketDTO.description());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{basketId}/nutritional-values")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<NutritionalValueSummaryDTO>> getSumOfNutritionalValues(@PathVariable UUID basketId) {
        return ResponseEntity.ok(basketService.getNutritionalValues(basketId));
    }

    @GetMapping("/{basketId}/allergens")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<String>> getAllergensInBasket(@PathVariable UUID basketId) {
        return ResponseEntity.ok(basketService.getBasketAllergens(basketId));
    }

    @PostMapping("/{basketId}/clone")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> cloneBasket(@PathVariable UUID basketId,@RequestBody CreateBasketDTO basketDTO) throws NotFoundException {
        Basket basket = basketService.cloneBasket(basketId, basketDTO.name(), basketDTO.description());
        return ResponseEntity.status(HttpStatus.CREATED).body(BasketMapper.INSTANCE.basketToBasketDTO(basket));
    }

    @GetMapping("/filtered")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketsPageDTO> getFilteredBaskets(@RequestParam(defaultValue = "10") int elements,
                                                              @RequestParam(defaultValue = "0") int page, BasketFilteringDTO filters) {
        Specification<Basket> specification = BasketSpecificationUtil.createSpecification(filters);
        Page<Basket> baskets = basketService.getFilteredBaskets(elements, page, specification);
        return ResponseEntity.ok(new BasketsPageDTO(BasketMapper.INSTANCE.basketsToBasketDTOs(baskets.getContent()), baskets.getTotalPages()));
    }


}
