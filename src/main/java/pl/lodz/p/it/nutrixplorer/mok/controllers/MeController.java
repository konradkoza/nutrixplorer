package pl.lodz.p.it.nutrixplorer.mok.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.ApplicationOptimisticLockException;
import pl.lodz.p.it.nutrixplorer.exceptions.InvalidHeaderException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.dto.*;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.UserService;
import pl.lodz.p.it.nutrixplorer.utils.ETagSigner;
import pl.lodz.p.it.nutrixplorer.utils.PasswordHolder;

@RequiredArgsConstructor
@Controller
@RequestMapping("/me")
public class MeController {
    private final UserService userService;
    private final ETagSigner signer;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getMe() throws NotFoundException, InvalidHeaderException {
        User user = userService.getCurrentUser();
        return ResponseEntity.status(HttpStatus.OK).body(UserMapper.INSTANCE.userToUserDTO(user));
    }

    @GetMapping("/details")
    public ResponseEntity<UserDetailsDTO> getMeDetails() throws NotFoundException, InvalidHeaderException {
        User user = userService.getCurrentUser();
        return ResponseEntity.status(HttpStatus.OK).eTag(signer.generateSignature(user.getId(), user.getVersion())).body(UserMapper.INSTANCE.userToUserDetailsDTO(user));
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordDTO changePasswordDTO) throws NotFoundException, AuthenctiactionFailedException {
        userService.changeOwnPassword(new PasswordHolder(changePasswordDTO.newPassword()), new PasswordHolder(changePasswordDTO.oldPassword()));
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/change-email-init")
    public ResponseEntity<Void> changeEmail(@RequestBody @Valid ChangeEmailDTO changeEmailDTO) throws NotFoundException, TokenGenerationException, EmailAddressInUseException {
        userService.changeOwnEmailInit(changeEmailDTO.newEmail());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/change-email")
    public ResponseEntity<Void> changeEmail(@RequestBody @Valid ConfirmEmailChangeDTO confirmEmailChangeDTO) throws EmailAddressInUseException, VerificationTokenInvalidException, VerificationTokenExpiredException {
        userService.changeOwnEmailFinish(confirmEmailChangeDTO.token());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/name")
    public ResponseEntity<Void> changeName(@RequestBody UserDTO userDTO, @RequestHeader(HttpHeaders.IF_MATCH) String tagValue) throws NotFoundException, InvalidHeaderException, ApplicationOptimisticLockException {
        userService.changeOwnNameAndLastName(userDTO.firstName(), userDTO.lastName(), tagValue);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/language")
    public ResponseEntity<Void> changeLanguage(@RequestBody @Valid LanguageDTO languageDTO) throws NotFoundException {
        userService.changeOwnLanguage(languageDTO.language());
        return ResponseEntity.ok().build();
    }
}
