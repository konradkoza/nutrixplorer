package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.model.mow.BasketEntry;

import java.util.Optional;
import java.util.UUID;

@Transactional(propagation = Propagation.MANDATORY)
@Repository
public interface BasketEntryRepository extends JpaRepository<BasketEntry, UUID> {




    @Query("SELECT b FROM BasketEntry b WHERE b.id = :id AND b.basket.client.user.id = :user")
    Optional<BasketEntry> findByIdAndUser(@Param("id") UUID id, @Param("user") UUID user);
}
