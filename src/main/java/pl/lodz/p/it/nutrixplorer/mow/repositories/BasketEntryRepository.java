package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.lodz.p.it.nutrixplorer.model.mow.BasketEntry;

import java.util.UUID;

public interface BasketEntryRepository extends JpaRepository<BasketEntry, UUID> {

}
