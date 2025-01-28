package pl.lodz.p.it.nutrixplorer.mow.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.ApplicationOptimisticLockException;
import pl.lodz.p.it.nutrixplorer.exceptions.InvalidHeaderException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.BasketEntryException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.BasketNameNotUniqueException;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.mow.dto.*;
import pl.lodz.p.it.nutrixplorer.mow.mappers.BasketMapper;
import pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO;
import pl.lodz.p.it.nutrixplorer.mow.services.BasketService;
import pl.lodz.p.it.nutrixplorer.utils.ETagSigner;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/basket")
@Slf4j
public class BasketController {

    private final BasketService basketService;
    private final ETagSigner signer;

    @GetMapping("/user")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BasketDTO>> getUserBaskets() {
        return ResponseEntity.ok(
                BasketMapper.INSTANCE
                        .basketsToBasketDTOs(
                                basketService.getUserBaskets()));
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketSimpleDTO> createBasket(
            @RequestBody @Valid CreateBasketDTO createBasketDTO)
            throws NotFoundException, BasketNameNotUniqueException {
        Basket basket = basketService.createBasket(createBasketDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BasketMapper.INSTANCE.basketToBasketSimpleDTO(basket));
    }

    @GetMapping("/user/filtered")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BasketSimpleDTO>> getUserBasketsList(@RequestParam(defaultValue = "") String name) {
        return ResponseEntity.ok(BasketMapper.INSTANCE.basketsToBasketSimpleDTOs(basketService.getUserBasketsByName(name)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> getBasket(@PathVariable UUID id) throws NotFoundException, InvalidHeaderException {
        Basket basket = basketService.getBasket(id);
        return ResponseEntity.status(HttpStatus.OK).eTag(signer.generateSignature(basket.getId(), basket.getVersion())).body(BasketMapper.INSTANCE.basketToBasketDTO(basketService.getBasket(id)));
    }



    @PostMapping("/{basketId}/entry")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> addEntryToBasket(@PathVariable UUID basketId, @RequestBody @Valid BasketEntryDTO entryDTO) throws NotFoundException, BasketEntryException {
        Basket basket = basketService.addEntryToBasket(basketId, entryDTO);
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
    public ResponseEntity<Void> updateBasketEntry(@RequestBody UpdateEntryDTO entryDTO, @PathVariable UUID entryId) throws NotFoundException, BasketEntryException {
        basketService.updateEntry(entryId, entryDTO);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{basketId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> updateBasket(@RequestBody @Valid CreateBasketDTO basketDTO, @PathVariable UUID basketId,  @RequestHeader(HttpHeaders.IF_MATCH) String tagValue) throws NotFoundException, InvalidHeaderException, ApplicationOptimisticLockException, BasketNameNotUniqueException {

        basketService.updateBasket(basketId, basketDTO, tagValue);
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

    @PostMapping("/{basketId}/copy")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> copyBasket(@PathVariable UUID basketId, @RequestBody @Valid CreateBasketDTO basketDTO) throws NotFoundException, BasketNameNotUniqueException {
        Basket basket = basketService.copyBasket(basketId, basketDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(BasketMapper.INSTANCE.basketToBasketDTO(basket));
    }

    @GetMapping("/filtered")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketsPageDTO> getFilteredBaskets(@RequestParam(defaultValue = "10") int elements,
                                                              @RequestParam(defaultValue = "0") int page, BasketFilteringDTO filters) {
        Page<Basket> baskets = basketService.getFilteredBaskets(elements, page, filters);
        return ResponseEntity.ok(new BasketsPageDTO(BasketMapper.INSTANCE.basketsToBasketDTOs(baskets.getContent()), baskets.getTotalPages()));
    }


}
