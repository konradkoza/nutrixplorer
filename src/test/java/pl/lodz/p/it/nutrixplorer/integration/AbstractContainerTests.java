package pl.lodz.p.it.nutrixplorer.integration;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.MountableFile;



@Slf4j
public class AbstractContainerTests implements BeforeAllCallback {

    public static String baseUrl = "http://localhost";

    static PostgreSQLContainer<?> postgresContainer = new PostgreSQLContainer<>("postgres:16.6-alpine")
            .withCopyFileToContainer(MountableFile.forClasspathResource("initTestDb.sql"), "/docker-entrypoint-initdb.d/init.sql")
            .withUsername("nutriadmin")
            .withPassword("adminP@ssw0rd")
            .withDatabaseName("nutrixplorertest")
            .withReuse(true);


    private void updateDataSourceProps(PostgreSQLContainer<?> container) {
        String url = container.getJdbcUrl().substring(0, container.getJdbcUrl().lastIndexOf('/'));
        log.info("Setting up new propeties url: {}", url);
        String jdbcUrl = url + "/nutrixplorertest";
        System.setProperty("datasource.admin.jdbc-url", jdbcUrl);
        System.setProperty("datasource.mokuser.jdbc-url", jdbcUrl);
        System.setProperty("datasource.mowuser.jdbc-url", jdbcUrl);
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
