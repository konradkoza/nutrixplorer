package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordDTO(
        @NotBlank(message = "Old password cannot be empty")
        @Size(min = 8, max = 100, message = "Old password must be between 8 and 100 characters long")
        String oldPassword,
        @NotBlank(message = "New password cannot be empty")
        @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters long")
        String newPassword
) {
}
