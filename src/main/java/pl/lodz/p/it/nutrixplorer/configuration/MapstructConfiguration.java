package pl.lodz.p.it.nutrixplorer.configuration;

import org.mapstruct.MapperConfig;
import org.mapstruct.ReportingPolicy;
import org.springframework.context.annotation.Configuration;

@MapperConfig(
        componentModel = "spring",
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
@Configuration
public interface MapstructConfiguration {
}
