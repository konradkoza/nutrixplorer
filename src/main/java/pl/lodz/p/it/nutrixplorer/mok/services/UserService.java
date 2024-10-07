package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final AdministratorRepository administratorRepository;
    private final UserRepository repository;
    @Transactional
    public void addUser() {
        User user = new User();
        user.setActive(true);
        user.setEmail("email@address.com");
        user.setFirstName("firstName");
        user.setLastName("lastName");
//        user.setLogin("login2");
        user.setPassword("password");
        user.setVerified(true);
        user.setBlocked(false);
        user.setLoginAttempts(0);
        user.setLastFailedLoginIp("lastFailedLoginIp");
        user.setLastSuccessfulLoginIp("lastSuccessfulLoginIp");


        repository.save(user);

        Administrator administrator = new Administrator();
        administrator.setUser(user);
        administratorRepository.save(administrator);
    }
}
