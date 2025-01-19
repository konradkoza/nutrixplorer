package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.model.mow.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional(propagation = Propagation.MANDATORY, transactionManager = "mowTransactionManager", isolation = Isolation.READ_COMMITTED)
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p.label.image FROM Product p WHERE p.id = :id")
    Optional<byte[]> findProductImageById(@Param("id") UUID id);

    @Query("SELECT p FROM Product p JOIN p.usersWhoFavourited u WHERE u.user.id = :userId")
    Page<Product> findFavoriteProductsByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.usersWhoFavourited u WHERE u.user.id = :userId")
    List<Product> findFavoriteProductsByUserId(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT p.packageType FROM Product p")
    List<PackageType> findDistinctPackageTypes();

    @Query("SELECT DISTINCT p.label.allergenList FROM Product p")
    List<Allergen> findAllAllergens();

    @Query("SELECT DISTINCT p.country FROM Product p")
    List<String> findAllCountries();

    @Query("SELECT DISTINCT p FROM Product p WHERE lower(p.productName) LIKE %:productName%")
    Page<Product> findProductByProductNameContaining(String productName, Pageable pageable);

    @Query("SELECT COUNT(p) > 0 FROM Product p JOIN p.usersWhoFavourited u WHERE p.id = :productId AND u.user.id = :userId")
    boolean isProductFavoritedByUser(@Param("productId") UUID productId, @Param("userId") UUID userId);
}
