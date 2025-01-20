package pl.lodz.p.it.nutrixplorer.integration;


import com.github.database.rider.core.api.configuration.DBUnit;
import com.github.database.rider.core.api.configuration.Orthography;
import com.github.database.rider.spring.api.DBRider;
import org.dbunit.ext.postgresql.PostgresqlDataTypeFactory;

@DBRider(dataSourceBeanName = "adminDatasource")
@DBUnit(schema = "public", dataTypeFactoryClass = PostgresqlDataTypeFactory.class, caseInsensitiveStrategy = Orthography.LOWERCASE)
public interface AbstractDBRiderTests {
}
