package pl.lodz.p.it.nutrixplorer.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.hibernate.tool.schema.Action;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class AdminDataSourceConfiguration {

    @Bean
    @ConfigurationProperties(prefix = "datasource.admin")
    public DataSourceConfigProperties adminDataSourceConfigProperties() {
        return new DataSourceConfigProperties();
    }

    @Bean("adminDatasource")
    @Primary
    public DataSource adminDatasource(@Qualifier("adminDataSourceConfigProperties") DataSourceConfigProperties adminDataSourceConfigProperties) {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl (adminDataSourceConfigProperties.getJdbcUrl());
        hikariConfig.setUsername(adminDataSourceConfigProperties.getUsername());
        hikariConfig.setPassword(adminDataSourceConfigProperties.getPassword());
        hikariConfig.setDriverClassName("org.postgresql.Driver");
        return new HikariDataSource(hikariConfig);
    }

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(false);
        vendorAdapter.setDatabase(Database.POSTGRESQL);
        return vendorAdapter;
    }

    @Bean(name = "adminEntityManagerFactory")
    @Primary
    public LocalContainerEntityManagerFactoryBean adminEntityManagerFactory(
            @Qualifier("adminDatasource") DataSource adminDatasource) {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(adminDatasource);
        emf.setPersistenceUnitName("adminPU");
        emf.setPackagesToScan("pl.lodz.p.it.nutrixplorer.model");
        emf.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        Properties properties = new Properties();
        properties.put(AvailableSettings.SHOW_SQL, "true");
        properties.put(AvailableSettings.JAKARTA_TRANSACTION_TYPE, "RESOURCE_LOCAL");
        properties.put(AvailableSettings.HBM2DDL_AUTO, Action.UPDATE);
        emf.setJpaProperties(properties);
        emf.afterPropertiesSet();
        return emf;
    }
}
