package pl.lodz.p.it.nutrixplorer.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfiguration {
    private DataSourceConfigProperties adminDataSourceConfigProperties;
    private DataSourceConfigProperties userDataSourceConfigProperties;

    @Bean
    @ConfigurationProperties(prefix = "datasource.admin")
    public DataSourceConfigProperties adminDataSourceConfigProperties() {
        return new DataSourceConfigProperties();
    }

    @Bean
    @ConfigurationProperties(prefix = "datasource.user")
    public DataSourceConfigProperties userDataSourceConfigProperties() {
        return new DataSourceConfigProperties();
    }

    @Bean
    public DataSource adminDatasource(DataSourceConfigProperties adminDataSourceConfigProperties) {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl (adminDataSourceConfigProperties().getJdbcUrl());
        hikariConfig.setUsername(adminDataSourceConfigProperties.getUsername());
        hikariConfig.setPassword(adminDataSourceConfigProperties.getPassword());
        hikariConfig.setDriverClassName("org.postgresql.Driver");
        // Custom HikariCP settings
        hikariConfig.setMaximumPoolSize(20);
        hikariConfig.setMinimumIdle(10);
        hikariConfig.setConnectionTimeout(30000);
        hikariConfig.setIdleTimeout(600000);
        hikariConfig.setMaxLifetime(1800000);
        hikariConfig.setTransactionIsolation("TRANSACTION_READ_COMMITTED");
        return new HikariDataSource(hikariConfig);
    }


    @Bean
    public JdbcTemplate adminJdbcTemplate(@Qualifier("adminDatasource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }


    @Bean
    @Primary
    public DataSource userDatasource(DataSourceConfigProperties userDataSourceConfigProperties) {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(userDataSourceConfigProperties().getJdbcUrl());
        hikariConfig.setUsername(userDataSourceConfigProperties.getUsername());
        hikariConfig.setPassword(userDataSourceConfigProperties.getPassword());
        hikariConfig.setDriverClassName("org.postgresql.Driver");
        // Custom HikariCP settings
        hikariConfig.setMaximumPoolSize(20);
        hikariConfig.setMinimumIdle(10);
        hikariConfig.setConnectionTimeout(30000);
        hikariConfig.setIdleTimeout(600000);
        hikariConfig.setMaxLifetime(1800000);
        hikariConfig.setTransactionIsolation("TRANSACTION_READ_COMMITTED");
        return new HikariDataSource(hikariConfig);
    }

    @Bean
    public JdbcTemplate userJdbcTemplate(@Qualifier("userDatasource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

//    @Bean
//    public JdbcTemplate ffadminJdbcTemplate(@Qualifier("ffadminDatasource") DataSource dataSource) {
//        return new JdbcTemplate(dataSource);
//    }
//
//    @Bean
//    public DataSource ffadminDatasource() {
//        HikariConfig hikariConfig = new HikariConfig();
//        hikariConfig.setJdbcUrl("jdbc:postgresql://localhost:5432/nutrixplorer");
//        hikariConfig.setUsername("ffadmin");
//        hikariConfig.setPassword("ffadminP@ssw0rd");
//        hikariConfig.setDriverClassName("org.postgresql.Driver");
//
//        // Custom HikariCP settings
//        hikariConfig.setMaximumPoolSize(20);
//        hikariConfig.setMinimumIdle(10);
//        hikariConfig.setConnectionTimeout(30000);
//        hikariConfig.setIdleTimeout(600000);
//        hikariConfig.setMaxLifetime(1800000);
//        hikariConfig.setTransactionIsolation("TRANSACTION_READ_COMMITTED");
//        return new HikariDataSource(hikariConfig);
//    }

}
