package pl.lodz.p.it.nutrixplorer;

import org.mapstruct.MapperConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(
		basePackages = "pl.lodz.p.it.nutrixplorer.mok.repositories",  // Repository package for user
		entityManagerFactoryRef = "userEntityManagerFactory",
		transactionManagerRef = "userTransactionManager"
)
public class NutrixplorerApplication {

	public static void main(String[] args) {
		SpringApplication.run(NutrixplorerApplication.class, args);
	}

}
