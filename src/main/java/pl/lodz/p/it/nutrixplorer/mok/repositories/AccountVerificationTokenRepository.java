package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.mok.AccountVerificationToken;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountVerificationTokenRepository extends JpaRepository<AccountVerificationToken, UUID> {
    Optional<AccountVerificationToken> findByToken(String token);

    Optional<AccountVerificationToken> findByUserId(UUID id);

    void deleteByUserId(UUID id);

    @Query("SELECT t FROM AccountVerificationToken t WHERE t.user.email = :email")
    Optional<AccountVerificationToken> findByUserEmail(String email);
}
