package pl.lodz.p.it.nutrixplorer.mok.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.lodz.p.it.nutrixplorer.model.Administrator;

import java.util.UUID;

@Repository()
public interface AdministratorRepository extends JpaRepository<Administrator, UUID>{
}
