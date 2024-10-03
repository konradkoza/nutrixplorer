package pl.lodz.p.it.nutrixplorer.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfiguration {


    @Bean
    public DataSource adminDatasource() {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl("jdbc:postgresql://localhost:5432/nutrixplorer");
        hikariConfig.setUsername("nutriadmin");
        hikariConfig.setPassword("adminP@ssw0rd");
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
    public DataSource userDatasource() {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl("jdbc:postgresql://localhost:5432/nutrixplorer");
        hikariConfig.setUsername("nutriuser");
        hikariConfig.setPassword("mokP@ssw0rd");
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


}
