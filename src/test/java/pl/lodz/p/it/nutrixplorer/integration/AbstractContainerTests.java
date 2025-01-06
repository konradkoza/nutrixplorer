package pl.lodz.p.it.nutrixplorer.integration;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.MountableFile;

@Testcontainers
public abstract class AbstractContainerTest {

    @Container
    static PostgreSQLContainer<?> postgresContainer = new PostgreSQLContainer<>("postgres:16.6-alpine")
            .withCopyFileToContainer(MountableFile.forClasspathResource("initTestDb.sql"), "/docker-entrypoint-initdb.d/init.sql");

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        String url = postgresContainer.getJdbcUrl().substring(0, postgresContainer.getJdbcUrl().lastIndexOf('/'));
        String jdbcUrl = url + "/nutrixplorertest";
        registry.add("datasource.admin.jdbc-url", () ->  jdbcUrl);
        registry.add("datasource.user.jdbc-url", () ->  jdbcUrl);
        registry.add("spring.flyway.url", () ->  jdbcUrl);
    }
}
