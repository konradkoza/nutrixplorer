package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketEntryDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.CreateBasketDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.UpdateEntryDTO;
import pl.lodz.p.it.nutrixplorer.mow.mappers.BasketMapper;
import pl.lodz.p.it.nutrixplorer.mow.services.BasketService;

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

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> getBasket(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(BasketMapper.INSTANCE.basketToBasketDTO(basketService.getBasket(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> createBasket(@RequestBody CreateBasketDTO createBasketDTO) throws NotFoundException {
        Basket basket = basketService.createBasket(BasketMapper.INSTANCE.basketEntryDTOsToBasketEntries(createBasketDTO.basketEntries()));
        return ResponseEntity.status(HttpStatus.CREATED).body(BasketMapper.INSTANCE.basketToBasketDTO(basket));
    }

    @PostMapping("/{basketId}/entry")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BasketDTO> addEntryToBasket(@PathVariable UUID basketId, @RequestBody BasketEntryDTO entryDTO) throws NotFoundException {
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
    public ResponseEntity<Void> updateBasket(@RequestBody UpdateEntryDTO entryDTO, @PathVariable UUID entryId) throws NotFoundException {
        basketService.updateEntry(entryId, entryDTO.quantity());
        return ResponseEntity.ok().build();
    }


}
