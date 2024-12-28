package pl.lodz.p.it.nutrixplorer.mok.dto;

import java.time.LocalDateTime;
import java.util.List;

public record UserDetailsDTO(
        String id,
        String firstName,
        String lastName,
        String email,
        boolean oauth,
        List<String> accessLevels,
        boolean blocked,
        boolean verified,
        String language,
        int loginAttempts,
        LocalDateTime lastSuccessfulLogin,
        LocalDateTime lastFailedLogin,
        String lastSuccessfulLoginIp,
        String lastFailedLoginIp
) {
}
