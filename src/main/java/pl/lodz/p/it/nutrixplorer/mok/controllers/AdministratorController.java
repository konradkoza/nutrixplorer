package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.mok.services.AdministratorService;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/administrator")
@Transactional(propagation = Propagation.NEVER, transactionManager = "mokTransactionManager")
public class AdministratorController {
    private final AdministratorService administratorService;

    @DeleteMapping(path = "/{id}/access-level")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> removeAccessLevel(@PathVariable UUID id) throws AccessLevelAssignException, NotFoundException {
        administratorService.removeAdministratorAccessLevel(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping(path = "/{id}/access-level")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> addAccessLevel(@PathVariable UUID id) throws AccessLevelAssignException, NotFoundException {
        administratorService.addAdministratorAccessLevel(id);
        return ResponseEntity.ok().build();
    }
}
