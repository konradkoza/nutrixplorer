package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;
import pl.lodz.p.it.nutrixplorer.exceptions.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.mok.services.AdministratorService;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/administrator")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class AdministratorController {
    private final AdministratorService administratorService;

    @PutMapping(path = "/{id}/assign")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> removeAccessLevel(@PathVariable UUID id) throws AccessLevelAssignException, NotFoundException {
        UUID administratorId = SecurityContextUtil.getCurrentUser();
        administratorService.removeAdministratorAccessLevel(id, administratorId);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/{id}/assign")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> addAccessLevel(@PathVariable UUID id) throws AccessLevelAssignException, NotFoundException {
        administratorService.addAdministratorAccessLevel(id);
        return ResponseEntity.ok().build();
    }
}
