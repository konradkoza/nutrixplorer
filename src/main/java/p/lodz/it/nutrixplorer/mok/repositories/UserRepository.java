package p.lodz.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import p.lodz.it.nutrixplorer.model.User;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
