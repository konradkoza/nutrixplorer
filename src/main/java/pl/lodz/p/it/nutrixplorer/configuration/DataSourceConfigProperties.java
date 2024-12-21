package pl.lodz.p.it.nutrixplorer.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
public class DataSourceConfigProperties {
    private String jdbcUrl;
    private String username;
    private String password;
}
