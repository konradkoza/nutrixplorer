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
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional(propagation = Propagation.MANDATORY, transactionManager = "mowTransactionManager", isolation = Isolation.READ_COMMITTED)
public interface BasketRepository extends JpaRepository<Basket, UUID>, JpaSpecificationExecutor<Basket> {

    @Query("SELECT b FROM Basket b WHERE b.client.user.id = :userId")
    List<Basket> findAllByUserId(UUID userId);

    @Query("SELECT b FROM Basket b WHERE b.client.user.id = :userId")
    Page<Basket> findAllByUserId(UUID userId, Pageable pageable);

    @Query("SELECT b FROM Basket b WHERE b.client.user.id = :userId AND b.id = :basketId")
    Optional<Basket> findByIdAndUserId(UUID basketId, UUID userId);

    @Query("SELECT new pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO(nv.nutritionalValueName.name,nv.nutritionalValueName.group.groupName, " +
            """     
                    SUM(cast(CASE WHEN ((p.unit.name = 'l')) THEN be.units * 1000 * nv.quantity / 100 ELSE be.units * nv.quantity / 100 END as double))
                     , nv.unit.name )
                    """ +
            "FROM Basket b " +
            "JOIN b.basketEntries be " +
            "JOIN be.product p " +
            "JOIN p.nutritionalValues nv " +
            "WHERE b.id = :basketId " +
            "AND b.client.user.id = :userId " +
            "GROUP BY nv.nutritionalValueName.group.groupName, nv.nutritionalValueName.name, nv.unit.name")
    List<NutritionalValueSummaryDTO> findSumOfNutritionalValuesByBasketIdAndUserId(@Param("basketId") UUID basketId, @Param("userId") UUID userId);

    @Query("SELECT DISTINCT a.name FROM Basket b " +
            "JOIN b.basketEntries be " +
            "JOIN be.product p " +
            "JOIN p.label.allergenList a " +
            "WHERE b.id = :basketId")
    List<String> findDistinctAllergensByBasketId(@Param("basketId") UUID basketId);

    @Query("SELECT b FROM Basket b WHERE b.client.user.id = :userId AND b.id = :basketId")
    Optional<Basket> findByIdAndClient(UUID userId, UUID basketId);
}
