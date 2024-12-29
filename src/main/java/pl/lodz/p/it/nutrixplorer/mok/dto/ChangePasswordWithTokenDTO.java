package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordWithTokenDTO(
        @NotBlank(message = "Token cannot be empty")
        String token,
        @NotBlank(message = "New password cannot be empty")
        @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters long")
        String newPassword
) {
}
