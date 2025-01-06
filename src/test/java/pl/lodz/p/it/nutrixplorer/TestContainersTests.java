package pl.lodz.p.it.nutrixplorer.integration;


import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.MountableFile;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
@Testcontainers
public class TestContainersTests {

    @Container
    static PostgreSQLContainer<?> postgresContainer = new PostgreSQLContainer<>("postgres:16.6-alpine")
            .withCopyFileToContainer(MountableFile.forClasspathResource("initTestDb.sql"), "/docker-entrypoint-initdb.d/init.sql")
            .withUsername("nutriuser").withPassword("nutripassword");

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        String url = postgresContainer.getJdbcUrl().substring(0, postgresContainer.getJdbcUrl().lastIndexOf('/'));
        String jdbcUrl = url + "/nutrixplorertest";
//        registry.add("datasource.admin.jdbc-url", () ->  jdbcUrl);
//        registry.add("datasource.user.jdbc-url", () ->  jdbcUrl);
        registry.add("spring.datasource.url", () -> jdbcUrl);
        registry.add("spring.datasource.username", postgresContainer::getUsername);
        registry.add("spring.datasource.password", postgresContainer::getPassword);
        registry.add("spring.flyway.url", () ->  jdbcUrl);
        registry.add("spring.flyway.user", postgresContainer::getUsername);
        registry.add("spring.flyway.password", postgresContainer::getPassword);
    }


    @Test
    public void connectionEstablished() {
        assertThat(postgresContainer.isCreated()).isTrue();
        assertThat(postgresContainer.isRunning()).isTrue();
    }
}
