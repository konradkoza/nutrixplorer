package pl.lodz.p.it.nutrixplorer.integration;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.MountableFile;


//@TestConfiguration(proxyBeanMethods = false)
@Slf4j
public class AbstractContainerTests implements BeforeAllCallback {

    public static String baseUrl = "http://localhost";

    static PostgreSQLContainer<?> postgresContainer = new PostgreSQLContainer<>("postgres:16.6-alpine")
            .withCopyFileToContainer(MountableFile.forClasspathResource("initTestDb.sql"), "/docker-entrypoint-initdb.d/init.sql").withReuse(true);


//    void registerProperties(DynamicPropertyRegistry registry) {
//        String url = postgresContainer.getJdbcUrl().substring(0, postgresContainer.getJdbcUrl().lastIndexOf('/'));
//        log.info("Setting up new propeties url: {}", url);
//        String jdbcUrl = url + "/nutrixplorertest";
////        registry.add("datasource.admin.jdbc-url", () ->  jdbcUrl);
////        registry.add("datasource.user.jdbc-url", () ->  jdbcUrl);
//        registry.add("spring.datasource.url", () -> jdbcUrl);
//        registry.add("spring.datasource.username", postgresContainer::getUsername);
//        registry.add("spring.datasource.password", postgresContainer::getPassword);
//        registry.add("spring.flyway.url", () ->  jdbcUrl);
//        registry.add("spring.flyway.user", postgresContainer::getUsername);
//        registry.add("spring.flyway.password", postgresContainer::getPassword);
//    }



    private void updateDataSourceProps(PostgreSQLContainer<?> container) {
        String url = container.getJdbcUrl().substring(0, container.getJdbcUrl().lastIndexOf('/'));
        log.info("Setting up new propeties url: {}", url);
        String jdbcUrl = url + "/nutrixplorertest";
        System.setProperty("datasource.admin.jdbc-url", jdbcUrl);
        System.setProperty("datasource.user.jdbc-url", jdbcUrl);
        System.setProperty("spring.flyway.url", jdbcUrl);
        System.setProperty("spring.flyway.user", container.getUsername());
        System.setProperty("spring.flyway.password", container.getPassword());
    }

    @Override
    public void beforeAll(ExtensionContext context) {
        postgresContainer.start();
        updateDataSourceProps(postgresContainer);
    }
}
