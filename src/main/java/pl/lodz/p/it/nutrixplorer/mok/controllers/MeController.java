package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.mok.dto.ChangeEmailDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.ChangePasswordDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.ConfirmEmailChangeDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDTO;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.UserService;

@RequiredArgsConstructor
@Controller
@RequestMapping("/me")
public class MeController {
    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getMe() throws NotFoundException {
        return ResponseEntity.ok(UserMapper.INSTANCE.userToUserDTO(userService.getCurrentUser()));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) throws NotFoundException, AuthenctiactionFailedException {
        userService.changeOwnPassword(changePasswordDTO.newPassword(), changePasswordDTO.oldPassword());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-email-init")
    public ResponseEntity<Void> changeEmail(@RequestBody ChangeEmailDTO changeEmailDTO) throws NotFoundException, TokenGenerationException, EmailAddressInUseException {
        userService.changeOwnEmailInit(changeEmailDTO.newEmail());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-email")
    public ResponseEntity<Void> changeEmail(@RequestBody ConfirmEmailChangeDTO confirmEmailChangeDTO) throws EmailAddressInUseException, VerificationTokenInvalidException, VerificationTokenExpiredException {
        userService.changeOwnEmailFinish(confirmEmailChangeDTO.token());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/name")
    public ResponseEntity<Void> changeName(@RequestBody UserDTO userDTO) throws NotFoundException {
        userService.changeOwnNameAndLastName(userDTO.firstName(), userDTO.lastName());
        return ResponseEntity.ok().build();
    }
}
