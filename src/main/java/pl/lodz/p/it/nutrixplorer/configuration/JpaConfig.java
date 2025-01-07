package pl.lodz.p.it.nutrixplorer.configuration;

import jakarta.persistence.EntityManagerFactory;
import org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.hibernate.tool.schema.Action;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaDialect;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
//@Profile({"!test"})
public class JpaConfig {

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(false);
        vendorAdapter.setDatabase(Database.POSTGRESQL);
        return vendorAdapter;
    }

    @Bean(name = "userEntityManagerFactory")
    @Primary
    public LocalContainerEntityManagerFactoryBean userEntityManagerFactory(
            @Qualifier("userDatasource") DataSource userDataSource, JpaVendorAdapter jpaVendorAdapter) {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(userDataSource);
        emf.setPersistenceUnitName("userPU");
        emf.setPackagesToScan("pl.lodz.p.it.nutrixplorer.model");
        emf.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        emf.setJpaVendorAdapter(jpaVendorAdapter);
        Properties properties = new Properties();
        properties.put(AvailableSettings.SHOW_SQL, "true");
        properties.put("jakarta.persistence.transactionType", "RESOURCE_LOCAL");
        properties.put(AvailableSettings.ISOLATION, TransactionDefinition.ISOLATION_READ_COMMITTED);
        emf.setJpaProperties(properties);
        emf.afterPropertiesSet();
        return emf;
    }

    @Bean(name = "userTransactionManager")
    public PlatformTransactionManager userTransactionManager(
            @Qualifier("userEntityManagerFactory") EntityManagerFactory userEntityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager(userEntityManagerFactory);
        transactionManager.addListener(new TransactionListener());
        transactionManager.setJpaDialect(new HibernateJpaDialect());
        return transactionManager;
    }


    @Bean(name = "adminEntityManagerFactory")
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
        properties.put(AvailableSettings.HBM2DDL_AUTO, Action.CREATE);
        properties.put(AvailableSettings.PHYSICAL_NAMING_STRATEGY, PhysicalNamingStrategyStandardImpl.class);
//        properties.put(AvailableSettings.JAKARTA_HBM2DDL_LOAD_SCRIPT_SOURCE, "init.sql");
//        properties.put(AvailableSettings.HBM2DDL_IMPORT_FILES_SQL_EXTRACTOR, MultiLineSqlScriptExtractor.class.getName());
        emf.setJpaProperties(properties);
        emf.afterPropertiesSet();
        return emf;
    }
}
