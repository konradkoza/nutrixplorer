package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
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

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
@Transactional(propagation = Propagation.NEVER, transactionManager = "mokTransactionManager")
public class UserController {

    private final UserService userService;
    private final ETagSigner signer;


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<UserDetailsDTO> getUser(@PathVariable UUID id) throws NotFoundException, InvalidHeaderException {
        User user = userService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).eTag(signer.generateSignature(user.getId(), user.getVersion())).body(UserMapper.INSTANCE.userToUserDetailsDTO(userService.findById(id)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<UsersPageDTO> getAllUsers(@RequestParam(defaultValue = "10") int elements,
                                                    @RequestParam(defaultValue = "0") int page, UsersFilteringDTO filteringDTO) {
        Page<User> users = userService.findAllUsers(page, elements, filteringDTO);
        return ResponseEntity.ok(new UsersPageDTO(UserMapper.INSTANCE.usersToSimpleUserDTOs(users.getContent()), users.getTotalPages()));
    }

    @PatchMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> blockUser(@PathVariable UUID id) throws NotFoundException, BlockUserException {
        userService.blockUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> unblockUser(@PathVariable UUID id) throws NotFoundException, BlockUserException {
        userService.unblockUser(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/email")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> changeEmail(@PathVariable UUID id, @RequestBody ChangeEmailDTO changeEmailDTO) throws NotFoundException, TokenGenerationException, EmailAddressInUseException {
        userService.changeEmailInit(changeEmailDTO, id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/name")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> changeUserName(@PathVariable UUID id, @RequestBody UserDTO userDTO, @RequestHeader(HttpHeaders.IF_MATCH) String tagValue) throws NotFoundException, InvalidHeaderException, ApplicationOptimisticLockException {
        userService.changeNameAndLastName(id, userDTO, tagValue);
        return ResponseEntity.ok().build();
    }

}
