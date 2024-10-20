package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.BlockUserException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDTO;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.UserService;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user")
@Slf4j
@Transactional(propagation = Propagation.NEVER)
public class UserController {

    private final UserService userService;



    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) throws NotFoundException {
        log.info("Getting user with id: " + id);
        return ResponseEntity.ok(UserMapper.INSTANCE.userToUserDTO(userService.findById(id)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        log.info("Getting all users");
        return ResponseEntity.ok(UserMapper.INSTANCE.usersToUserDTOs(userService.getUsers()));
    }

    @PatchMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> blockUser(@PathVariable UUID id) throws NotFoundException, BlockUserException {
        log.info("Blocking user with id: " + id);
        userService.blockUser(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/unblock")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> unblockUser(@PathVariable UUID id) throws NotFoundException, BlockUserException {
        log.info("Unblocking user with id: " + id);
        userService.unblockUser(id);
        return ResponseEntity.ok().build();
    }


}
