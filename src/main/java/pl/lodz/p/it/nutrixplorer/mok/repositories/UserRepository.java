package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.lodz.p.it.nutrixplorer.model.User;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
