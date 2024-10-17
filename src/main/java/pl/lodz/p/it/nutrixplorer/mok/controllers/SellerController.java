package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.lodz.p.it.nutrixplorer.exceptions.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.mok.services.SellerService;

import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/seller")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class SellerController {
    private final SellerService sellerService;

    @PutMapping(path = "/{id}/assign")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> removeAccessLevel(@PathVariable UUID id) throws AccessLevelAssignException, NotFoundException {
        sellerService.removeSellerAccessLevel(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/{id}/assign")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> addAccessLevel(@PathVariable UUID id) throws AccessLevelAssignException, NotFoundException {
        sellerService.addSellerAccessLevel(id);
        return ResponseEntity.ok().build();
    }

}
