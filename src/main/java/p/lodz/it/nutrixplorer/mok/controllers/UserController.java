package p.lodz.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import p.lodz.it.nutrixplorer.model.Administrator;
import p.lodz.it.nutrixplorer.model.User;
import p.lodz.it.nutrixplorer.mok.repositories.AdministratorRepository;
import p.lodz.it.nutrixplorer.mok.repositories.UserRepository;
import p.lodz.it.nutrixplorer.mok.services.UserService;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user")
@CrossOrigin()
public class UserController {

    private final UserRepository repository;
    private final UserService userService;
    @PostMapping
    public ResponseEntity<String> createUser() {
        userService.addUser();

        return ResponseEntity.ok(repository.findAll().toString());
    }

    @GetMapping
    public ResponseEntity<String> getUser() {
        return ResponseEntity.ok(repository.findAll().toString());
    }
}
