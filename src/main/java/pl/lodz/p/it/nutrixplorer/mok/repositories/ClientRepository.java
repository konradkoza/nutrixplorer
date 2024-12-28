package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;

import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional(propagation = Propagation.MANDATORY)
public interface ClientRepository  extends JpaRepository<Client, UUID> {

    Optional<Client> findByUserId(UUID userId);

    void deleteClientById(UUID id);


    @Modifying
    @Query("delete from Client c where c.id = :id")
    void deleteByClientId(UUID id);
}
