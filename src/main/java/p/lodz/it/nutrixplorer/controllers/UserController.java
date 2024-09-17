package p.lodz.it.nutrixplorer.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import p.lodz.it.nutrixplorer.model.User;
import p.lodz.it.nutrixplorer.repositories.UserRepository;

@RequiredArgsConstructor
@Controller
@RequestMapping("/user")
@CrossOrigin()
public class UserController {

    private final UserRepository repository;

    @PostMapping
    public ResponseEntity<String> createUser() {
        User user = new User();
        user.setActive(true);
        user.setEmail("email");
        user.setFirstName("firstName");
        user.setLastName("lastName");
        user.setLogin("login");
        user.setPassword("password");
        user.setVerified(true);
        user.setBlocked(false);
        user.setLoginAttempts(0);
        user.setLastFailedLoginIp("lastFailedLoginIp");
        user.setLastSuccessfulLoginIp("lastSuccessfulLoginIp");


        repository.save(user);

        return ResponseEntity.ok(repository.findAll().toString());
    }

    @GetMapping
    public ResponseEntity<String> getUser() {
        return ResponseEntity.ok(repository.findAll().toString());
    }
}
