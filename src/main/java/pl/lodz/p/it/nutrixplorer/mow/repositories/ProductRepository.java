package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.mow.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("SELECT p.label.image FROM Product p WHERE p.id = :id")
    Optional<byte[]> findProductImageById(@Param("id") UUID id);

    @Query("SELECT p.producer FROM Product p WHERE p.id = :id")
    Optional<Producer> findProducerByProductId(@Param("id") UUID id);

    @Query("SELECT p.composition FROM Product p WHERE p.id = :id")
    Optional<Composition> findCompositionByProductId(@Param("id") UUID id);

    @Query("SELECT p.ratings FROM Product p WHERE p.id = :id")
    List<Rating> findRatingsByProductId(@Param("id") UUID id);

    @Query("SELECT p.nutritionalValues FROM Product p WHERE p.id = :id")
    List<NutritionalValue> findNutritionalValuesByProductId(@Param("id") UUID id);
}
