package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.mok.dto.*;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.AuthenticationService;

@RequiredArgsConstructor
@Controller
@RequestMapping("/auth")
@Transactional(propagation = Propagation.NEVER)
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthTokenDTO> login(@RequestBody AuthenticationDTO authenticationDTO) throws UserNotVerifiedException, NotFoundException, UserBlockedException, AuthenctiactionFailedException {
        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.login(authenticationDTO.email(), authenticationDTO.password())));
    }

    @PostMapping("/register-client")
    public ResponseEntity<UserDTO> registerClient(@RequestBody RegisterClientDTO registerClientDTO) throws EmailAddressInUseException {
        return ResponseEntity.ok(
                UserMapper.INSTANCE.userToUserDTO(
                        authenticationService.registerClient(
                                registerClientDTO.email(), registerClientDTO.password(), registerClientDTO.firstName(), registerClientDTO.lastName()
                        )));
    }

    @PostMapping("/register-seller")
    public ResponseEntity<UserDTO> registerSeller(@RequestBody RegisterSellerDTO registerSelletDTO) throws EmailAddressInUseException {
        return ResponseEntity.ok(
                UserMapper.INSTANCE.userToUserDTO(
                        authenticationService.registerSeller(
                                registerSelletDTO.email(), registerSelletDTO.password(), registerSelletDTO.firstName(), registerSelletDTO.lastName()
                        )));
    }
}
