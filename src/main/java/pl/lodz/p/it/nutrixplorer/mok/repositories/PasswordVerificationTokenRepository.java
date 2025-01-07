package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.lodz.p.it.nutrixplorer.model.mok.PasswordVerificationToken;

import java.util.Optional;
import java.util.UUID;

public interface PasswordVerificationTokenRepository extends JpaRepository<PasswordVerificationToken, UUID> {
    Optional<PasswordVerificationToken> findByToken(String token);

    @Query("SELECT t FROM PasswordVerificationToken t WHERE t.user.email = :email")
    Optional<PasswordVerificationToken> findByUserEmail(String email);

    void deleteByUserId(UUID id);
}
