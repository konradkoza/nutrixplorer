package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.lodz.p.it.nutrixplorer.exceptions.AuthenctiactionFailedException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.UserBlockedException;
import pl.lodz.p.it.nutrixplorer.exceptions.UserNotVerifiedException;
import pl.lodz.p.it.nutrixplorer.mok.dto.AuthTokenDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.AuthenticationDTO;
import pl.lodz.p.it.nutrixplorer.mok.services.AuthenticationService;

@RequiredArgsConstructor
@Controller
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthTokenDTO> login(@RequestBody AuthenticationDTO authenticationDTO) throws UserNotVerifiedException, NotFoundException, UserBlockedException, AuthenctiactionFailedException {
        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.login(authenticationDTO.email(), authenticationDTO.password())));
    }

    @PostMapping("/register-client")
    public ResponseEntity<String> registerClient() {
        return ResponseEntity.ok("Registered");
    }

    @PostMapping("/register-seller")
    public ResponseEntity<String> registerSeller() {
        return ResponseEntity.ok("Registered");
    }
}
