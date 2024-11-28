package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BasketRepository extends JpaRepository<Basket, UUID> {

    @Query("SELECT b FROM Basket b WHERE b.client.user.id = :userId")
    List<Basket> findAllByUserId(UUID userId);

//    @Query("SELECT new pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValuesDTO(nv.nutritionalValueName.name, nv.nutritionalValueName.group.groupName, SUM(nv.quantity))  FROM Basket b " +
//            "JOIN b.basketEntries p " +
//            "JOIN p.product.nutritionalValues nv " +
//            "WHERE b.id = :basketId " +
//            "GROUP BY nv.nutritionalValueName.name, nv.nutritionalValueName.group.groupName")
//    List<NutritionalValuesDTO> findSumOfNutritionalValuesByBasketId(UUID basketId);


    @Query("SELECT new pl.lodz.p.it.nutrixplorer.mow.repositories.dto.NutritionalValueSummaryDTO(nv.nutritionalValueName.name,nv.nutritionalValueName.group.groupName, " +
            """
                    cast(CASE WHEN ((nv.unit.name LIKE 'l')) THEN SUM(cast(be.units * 1000 * nv.quantity / 100 as double)) ELSE SUM(be.units * nv.quantity / 100) END as double)
                     , nv.unit.name )
                    """ +
            "FROM Basket b " +
            "JOIN b.basketEntries be " +
            "JOIN be.product p " +
            "JOIN p.nutritionalValues nv " +
            "WHERE b.id = :basketId " +
            "GROUP BY nv.nutritionalValueName.group.groupName, nv.nutritionalValueName.name, nv.unit.name")
    List<NutritionalValueSummaryDTO> findSumOfNutritionalValuesByBasketId(@Param("basketId") UUID basketId);

    @Query("SELECT DISTINCT a.name FROM Basket b " +
            "JOIN b.basketEntries be " +
            "JOIN be.product p " +
            "JOIN p.label.allergenList a " +
            "WHERE b.id = :basketId")
    List<String> findDistinctAllergensByBasketId(@Param("basketId") UUID basketId);

    @Query("SELECT b FROM Basket b WHERE b.client.user.id = :userId AND b.id = :basketId")
    Optional<Basket> findByIdAndClient(UUID userId, UUID basketId);
}
