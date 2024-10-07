package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDTO;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;
import pl.lodz.p.it.nutrixplorer.mok.services.UserService;

import java.util.List;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final UserRepository repository;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<String> createUser() {
        userService.addUser();

        return ResponseEntity.ok(repository.findAll().toString());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<List<UserDTO>> getUser() {
        log.info("Getting all users");
        log.info(repository.findAll().toString());
        return ResponseEntity.ok(UserMapper.INSTANCE.usersToUserDTOs(repository.findAll()));
    }
}
