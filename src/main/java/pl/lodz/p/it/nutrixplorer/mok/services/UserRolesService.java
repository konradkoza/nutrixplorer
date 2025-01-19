package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.MANDATORY, isolation = Isolation.READ_COMMITTED, transactionManager = "mokTransactionManager")
@LoggingInterceptor
public class UserRolesService {

    private final ClientRepository clientRepository;
    private final AdministratorRepository administratorRepository;

    public List<String> getUserRoles(UUID userId) {
        List<String> roles = new ArrayList<>();

        clientRepository.findByUserId(userId).ifPresent(owner -> {
            if (owner.isActive()) {
                roles.add("CLIENT");
            }
        });
        administratorRepository.findByUserId(userId).ifPresent(admin -> {
            if (admin.isActive()) {
                roles.add("ADMINISTRATOR");
            }
        });

        return roles;
    }
}
