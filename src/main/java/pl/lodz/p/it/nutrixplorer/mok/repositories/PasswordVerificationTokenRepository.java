package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.lodz.p.it.nutrixplorer.model.mok.PasswordVerificationToken;

import java.util.Optional;
import java.util.UUID;

public interface PasswordVerificationTokenRepository extends JpaRepository<PasswordVerificationToken, UUID> {
    Optional<PasswordVerificationToken> findByToken(String token);


    void deleteByUserId(UUID id);
}
