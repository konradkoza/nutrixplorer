package p.lodz.it.nutrixplorer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class NutrixplorerApplication {

	public static void main(String[] args) {
		SpringApplication.run(NutrixplorerApplication.class, args);
	}

}
