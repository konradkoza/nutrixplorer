package pl.lodz.p.it.nutrixplorer.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableJpaRepositories(
        basePackages = {"pl.lodz.p.it.nutrixplorer.mow.repositories"},
        entityManagerFactoryRef = "mowEntityManagerFactory",
        transactionManagerRef = "mowTransactionManager"
)
@EnableTransactionManagement
public class MowDatasourceConfig {
    @Value("${nutrixplorer.transaction.timeout}")
    private int transactionTimeout;
    @Bean
    @ConfigurationProperties(prefix = "datasource.mowuser")
    public DataSourceConfigProperties userDataSourceConfigProperties() {
        return new DataSourceConfigProperties();
    }
    @Bean
    public DataSource mowDatasource(
            @Qualifier("userDataSourceConfigProperties")
            DataSourceConfigProperties userDataSourceConfigProperties) {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(userDataSourceConfigProperties.getJdbcUrl());
        hikariConfig.setUsername(userDataSourceConfigProperties.getUsername());
        hikariConfig.setPassword(userDataSourceConfigProperties.getPassword());
        hikariConfig.setDriverClassName("org.postgresql.Driver");
        hikariConfig.setTransactionIsolation("TRANSACTION_READ_COMMITTED");
        hikariConfig.setAutoCommit(false);
        return new HikariDataSource(hikariConfig);
    }
    @Bean(name = "mowEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean userEntityManagerFactory(
            @Qualifier("mowDatasource") DataSource userDataSource,
            JpaVendorAdapter jpaVendorAdapter) {
        LocalContainerEntityManagerFactoryBean emf =
                new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(userDataSource);
        emf.setPersistenceUnitName("mowPU");
        emf.setPackagesToScan("pl.lodz.p.it.nutrixplorer.model");
        emf.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        emf.setJpaVendorAdapter(jpaVendorAdapter);
        Properties properties = new Properties();
        properties.put(AvailableSettings.SHOW_SQL, "false");
        properties.put(
                "jakarta.persistence.transactionType",
                "RESOURCE_LOCAL");
        emf.setJpaProperties(properties);
        emf.afterPropertiesSet();
        return emf;
    }
    @Bean(name = "mowTransactionManager")
    public PlatformTransactionManager mowTransactionManager(
            @Qualifier("mowEntityManagerFactory")
            EntityManagerFactory mowEntityManagerFactory) {
        JpaTransactionManager transactionManager =
                new JpaTransactionManager(mowEntityManagerFactory);
        transactionManager.addListener(new TransactionListener());
        transactionManager.setDefaultTimeout(transactionTimeout);
        return transactionManager;
    }
}
