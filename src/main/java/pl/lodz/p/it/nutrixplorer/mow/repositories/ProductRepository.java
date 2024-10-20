package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("SELECT p.label.image FROM Product p WHERE p.id = :id")
    Optional<byte[]> findProductImageById(@Param("id") UUID id);
}
