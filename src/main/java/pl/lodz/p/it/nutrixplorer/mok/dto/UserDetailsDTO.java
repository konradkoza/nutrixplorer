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
    @Override
    public String toString() {
        return "UserDetailsDTO{" +
                "id='" + id + '\'' +
                ", firstName='" + "******" + '\'' +
                ", lastName='" + "******" + '\'' +
                ", email='" + "****@***" + '\'' +
                ", oauth=" + oauth +
                ", accessLevels=" + accessLevels +
                ", blocked=" + blocked +
                ", verified=" + verified +
                ", language='" + language + '\'' +
                ", loginAttempts=" + loginAttempts +
                ", lastSuccessfulLogin=" + lastSuccessfulLogin +
                ", lastFailedLogin=" + lastFailedLogin +
                ", lastSuccessfulLoginIp='" + lastSuccessfulLoginIp + '\'' +
                ", lastFailedLoginIp='" + lastFailedLoginIp + '\'' +
                '}';
    }
}
