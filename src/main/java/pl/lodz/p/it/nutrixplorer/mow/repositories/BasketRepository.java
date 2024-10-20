package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;

import java.util.UUID;

@Repository
public interface BasketRepository extends JpaRepository<Basket, UUID> {
}
