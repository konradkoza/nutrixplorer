package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDetailsDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.UsersFilteringDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.UsersPageDTO;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.UserService;
import pl.lodz.p.it.nutrixplorer.utils.UserSpecificationUtil;

import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/users")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class UserController {

    private final UserService userService;



    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<UserDetailsDTO> getUser(@PathVariable UUID id) throws NotFoundException {
        log.info("Getting user with id: " + id);
        return ResponseEntity.ok(UserMapper.INSTANCE.userToUserDetailsDTO(userService.findById(id)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<UsersPageDTO> getAllUsers(@RequestParam(defaultValue = "10") int elements,
                                                    @RequestParam(defaultValue = "0") int page, UsersFilteringDTO filteringDTO) {

        log.info("Getting all users");
        Specification<User> specification = UserSpecificationUtil.createSpecification(filteringDTO);
        Page<User> users = userService.findAllUsers(page, elements, specification);
        return ResponseEntity.ok(new UsersPageDTO(UserMapper.INSTANCE.usersToSimpleUserDTOs(users.getContent()), users.getTotalPages()));
    }

    @PatchMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> blockUser(@PathVariable UUID id) throws NotFoundException, BlockUserException {
        log.info("Blocking user with id: " + id);
        userService.blockUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> unblockUser(@PathVariable UUID id) throws NotFoundException, BlockUserException {
        log.info("Unblocking user with id: " + id);
        userService.unblockUser(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/email")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> changeEmail(@PathVariable UUID id, @RequestBody String email) throws NotFoundException, TokenGenerationException, EmailAddressInUseException {
        log.info("Changing email for user with id: " + id);
        userService.changeEmailInit(email, id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/name")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> changeUserName(@PathVariable UUID id, @RequestBody UserDTO userDTO) throws NotFoundException {
        userService.changeNameAndLastName(id, userDTO.firstName(), userDTO.lastName());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> changeUserPassword(@PathVariable UUID id) throws UserNotVerifiedException, UserBlockedException {
        userService.changeUserPassword(id);
        return ResponseEntity.ok().build();
    }


}
