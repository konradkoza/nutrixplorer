package p.lodz.it.nutrixplorer.configuration;

import jakarta.persistence.EntityManagerFactory;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.dialect.PostgreSQLDialect;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.hibernate.tool.schema.Action;
import org.hibernate.tool.schema.internal.script.MultiLineSqlScriptExtractor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class JpaConfig {

    @Bean(name = "userEntityManagerFactory")
    @Primary
    public LocalContainerEntityManagerFactoryBean userEntityManagerFactory(
            @Qualifier("userDatasource") DataSource userDataSource) {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(userDataSource);
        emf.setPersistenceUnitName("userPU");
        emf.setPackagesToScan("p.lodz.it.nutrixplorer.model");
        emf.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        Properties properties = new Properties();
        properties.put(AvailableSettings.SHOW_SQL, "true");
        properties.put("jakarta.persistence.transactionType", "RESOURCE_LOCAL");
        emf.setJpaProperties(properties);
        emf.afterPropertiesSet();
        return emf;
    }

    @Bean(name = "userTransactionManager")
    public PlatformTransactionManager userTransactionManager(
            @Qualifier("userEntityManagerFactory") EntityManagerFactory userEntityManagerFactory) {
        return new JpaTransactionManager(userEntityManagerFactory);
    }


    @Bean(name = "adminEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean adminEntityManagerFactory(
            @Qualifier("adminDatasource") DataSource adminDatasource) {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(adminDatasource);
        emf.setPersistenceUnitName("adminPU");
        emf.setPackagesToScan("p.lodz.it.nutrixplorer.model");
        emf.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        Properties properties = new Properties();
        properties.put(AvailableSettings.SHOW_SQL, "true");
        properties.put(AvailableSettings.JAKARTA_TRANSACTION_TYPE, "RESOURCE_LOCAL");
        properties.put(AvailableSettings.HBM2DDL_AUTO, Action.CREATE_DROP);
        properties.put(AvailableSettings.JAKARTA_HBM2DDL_LOAD_SCRIPT_SOURCE, "init.sql");
        properties.put(AvailableSettings.HBM2DDL_IMPORT_FILES_SQL_EXTRACTOR, MultiLineSqlScriptExtractor.class.getName());
        emf.setJpaProperties(properties);
        emf.afterPropertiesSet();
        return emf;
    }
}
