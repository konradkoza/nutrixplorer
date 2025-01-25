package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.model.mok.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional(
        propagation = Propagation.MANDATORY,
        transactionManager = "mokTransactionManager",
        isolation = Isolation.READ_COMMITTED)
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    List<User> getUsersByCreatedAtBeforeAndVerifiedIsFalse(
            LocalDateTime beforeTime);

    @Query("SELECT u FROM User u " +
            "WHERE :createdAt < u.createdAt " +
            "AND u.createdAt < :createdAt2 " +
            "AND u.verified = false")
    List<User> getUsersToResendEmail(LocalDateTime createdAt, LocalDateTime createdAt2);
}
