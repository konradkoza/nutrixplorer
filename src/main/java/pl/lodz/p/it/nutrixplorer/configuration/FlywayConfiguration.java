package pl.lodz.p.it.nutrixplorer.configuration;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer;
import org.springframework.boot.autoconfigure.flyway.FlywayProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

@Configuration
public class FlywayConfiguration {

    @Bean
    FlywayMigrationInitializer flywayInitializer(Flyway flyway) {
        return new FlywayMigrationInitializer(flyway, (f) -> {
        });
    }

    static class Dummy {
    }

    @Bean
    @DependsOn("adminEntityManagerFactory")
    Dummy delayedFlywayInitializer(Flyway flyway, FlywayProperties flywayProperties) {
        if (flywayProperties.isEnabled())
            flyway.migrate();
        return new Dummy();
    }
}
