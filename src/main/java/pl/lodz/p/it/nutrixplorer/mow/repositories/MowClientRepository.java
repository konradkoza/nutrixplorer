package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;

import java.util.Optional;
import java.util.UUID;

public interface MowClientRepository extends JpaRepository<Client, UUID> {
    Optional<Client> findByUserId(UUID userId);

}
