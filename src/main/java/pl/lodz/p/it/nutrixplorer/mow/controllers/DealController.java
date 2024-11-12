package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.model.mow.Deal;
import pl.lodz.p.it.nutrixplorer.mow.dto.DealDetailsDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.DealPageDTO;
import pl.lodz.p.it.nutrixplorer.mow.mappers.DealMapper;
import pl.lodz.p.it.nutrixplorer.mow.services.DealService;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/deal")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class DealController {

    private final DealService dealService;

    @RequestMapping("/all")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<DealPageDTO> getAllDeals(@RequestParam(defaultValue = "10") int elements,
                                                   @RequestParam(defaultValue = "0") int page) {
        Page<Deal> deals = dealService.getAllDeals(elements, page);
        return ResponseEntity.ok(new DealPageDTO(
                        DealMapper.INSTANCE.dealsToDealSimpleDTOs(deals.getContent()),
                        deals.getTotalPages()
                )
        );
    }

    @RequestMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<DealPageDTO> getSellersDeals(@RequestParam(defaultValue = "10") int elements,
                                                               @RequestParam(defaultValue = "0") int page) {
        UUID userId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        Page<Deal> deals = dealService.getSellersDeals(userId, elements, page);
        return ResponseEntity.ok(new DealPageDTO(
                        DealMapper.INSTANCE.dealsToDealSimpleDTOs(deals.getContent()),
                        deals.getTotalPages()
                )
        );
    }

    @RequestMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<DealDetailsDTO> getDealById(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(DealMapper.INSTANCE.dealToDealDetailsDTO(dealService.getDealById(id)));
    }

    @RequestMapping("/current")
    @PreAuthorize("hasAnyRole('SELLER', 'CLIENT')")
    public ResponseEntity<DealPageDTO> getDeals(@RequestParam(defaultValue = "10") int elements,
                                                   @RequestParam(defaultValue = "0") int page) {
        Page<Deal> deals = dealService.getCurrentActiveDeals(elements, page);
        return ResponseEntity.ok(new DealPageDTO(
                        DealMapper.INSTANCE.dealsToDealSimpleDTOs(deals.getContent()),
                        deals.getTotalPages()
                )
        );
    }

    @RequestMapping("/current/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'CLIENT')")
    public ResponseEntity<DealDetailsDTO> getCurrentDealById(@PathVariable UUID id) throws NotFoundException {
        return ResponseEntity.ok(DealMapper.INSTANCE.dealToDealDetailsDTO(dealService.getCurrentDealById(id)));
    }


}
