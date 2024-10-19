package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDTO;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.UserService;

@RequiredArgsConstructor
@Controller
@RequestMapping("/me")
@Transactional(propagation = Propagation.NEVER)
public class MeController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDTO> getMe() throws NotFoundException {
        return ResponseEntity.ok(UserMapper.INSTANCE.userToUserDTO(userService.getCurrentUser()));
    }
}
