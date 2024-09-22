package p.lodz.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import p.lodz.it.nutrixplorer.model.Administrator;

import java.util.UUID;

@Repository()
public interface AdministratorRepository extends JpaRepository<Administrator, UUID>{
}
