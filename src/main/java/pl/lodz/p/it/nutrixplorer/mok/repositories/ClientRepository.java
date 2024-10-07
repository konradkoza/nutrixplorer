package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientRepository  extends JpaRepository<Client, UUID> {

    Optional<Client> findByUserId(UUID userId);
}
