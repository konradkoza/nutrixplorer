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
        basePackages = {"pl.lodz.p.it.nutrixplorer.mok.repositories"},
        entityManagerFactoryRef = "mokEntityManagerFactory",
        transactionManagerRef = "mokTransactionManager"
)
@EnableTransactionManagement
public class MokDatasourceConfig {

    @Value("${nutrixplorer.transaction.timeout}")
    private int transactionTimeout;

    @Bean
    @ConfigurationProperties(prefix = "datasource.mokuser")
    public DataSourceConfigProperties mokDataSourceConfigProperties() {
        return new DataSourceConfigProperties();
    }
    @Bean
    public DataSource mokDatasource(
            @Qualifier("mokDataSourceConfigProperties") DataSourceConfigProperties mokDataSourceConfigProperties) {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(mokDataSourceConfigProperties.getJdbcUrl());
        hikariConfig.setUsername(mokDataSourceConfigProperties.getUsername());
        hikariConfig.setPassword(mokDataSourceConfigProperties.getPassword());
        hikariConfig.setDriverClassName("org.postgresql.Driver");
        hikariConfig.setTransactionIsolation("TRANSACTION_READ_COMMITTED");
        hikariConfig.setAutoCommit(false);
        return new HikariDataSource(hikariConfig);
    }
    @Bean(name = "mokEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean mokEntityManagerFactory(
            @Qualifier("mokDatasource") DataSource mokDataSource,
            JpaVendorAdapter jpaVendorAdapter) {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(mokDataSource);
        emf.setPersistenceUnitName("mokPU");
        emf.setPackagesToScan("pl.lodz.p.it.nutrixplorer.model");
        emf.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        emf.setJpaVendorAdapter(jpaVendorAdapter);
        Properties properties = new Properties();
        properties.put(AvailableSettings.SHOW_SQL, "false");
        properties.put("jakarta.persistence.transactionType", "RESOURCE_LOCAL");
        emf.setJpaProperties(properties);
        emf.afterPropertiesSet();
        return emf;
    }
    @Bean(name = "mokTransactionManager")
    public PlatformTransactionManager mokTransactionManager(
            @Qualifier("mokEntityManagerFactory") EntityManagerFactory mokEntityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager(mokEntityManagerFactory);
        transactionManager.addListener(new TransactionListener());
        transactionManager.setDefaultTimeout(transactionTimeout);
        return transactionManager;
    }
}
