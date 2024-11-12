package pl.lodz.p.it.nutrixplorer.mow.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.mow.Deal;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DealRepository extends JpaRepository<Deal, UUID> {
    List<Deal> findDealsBySellerId(UUID sellerId);

    @Query("SELECT d FROM Deal d WHERE d.seller.user.id = :userId")
    Page<Deal> findSellerDealsByUserId(UUID userId, Pageable pageRequest);

    @Query("SELECT d FROM Deal d WHERE d.endDate >= CURRENT_DATE AND d.active = true")
    Page<Deal> findCurrentActiveDeals(Pageable of);

    @Query("SELECT d FROM Deal d WHERE d.id = :id AND d.endDate >= CURRENT_DATE AND d.active = true")
    Optional<Deal> findCurrentActiveDealById(UUID id);
}
