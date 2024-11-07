package pl.lodz.p.it.nutrixplorer.mow.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.model.mow.Deal;
import pl.lodz.p.it.nutrixplorer.mow.services.DealService;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.List;
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
    public List<Deal> getAllDeals() {
        return dealService.getAllDeals();
    }

    @RequestMapping("/seller}")
    @PreAuthorize("hasRole('SELLER')")
    public List<Deal> getSellersDeals() throws NotFoundException {
        UUID userId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        return dealService.getSellersDeals(userId);
    }

    @RequestMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public Deal getDealById(@PathVariable UUID id) throws NotFoundException {
        return dealService.getDealById(id);
    }

}
