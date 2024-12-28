package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;

import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional(propagation = Propagation.MANDATORY)
public interface AdministratorRepository extends JpaRepository<Administrator, UUID>{

    Optional<Administrator> findByUserId(UUID userId);

    @Modifying
    @Query("delete from Administrator a where a.id = :id")
    void deleteByAdminId(UUID id);
}
