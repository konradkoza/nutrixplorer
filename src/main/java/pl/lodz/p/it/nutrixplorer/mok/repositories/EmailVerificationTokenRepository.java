package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.lodz.p.it.nutrixplorer.model.mok.EmailVerificationToken;

import java.util.Optional;
import java.util.UUID;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {
    Optional<EmailVerificationToken> findByToken(String token);

    Optional<EmailVerificationToken> findByUserId(UUID id);

    void deleteEmailVerificationTokenByUserId(UUID id);

    @Query("SELECT t FROM EmailVerificationToken t WHERE t.user.email = :email")
    Optional<EmailVerificationToken> findByUserEmail(String email);
}
