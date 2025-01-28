package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordDTO(
        @NotBlank(message = "Old password cannot be empty")
        @Size(min = 8, max = 100, message = "Old password must be between 8 and 100 characters long")
        String oldPassword,
        @NotBlank(message = "Password cannot be empty")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters long")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character"
        )
        String newPassword
) {
        @Override
        public String toString() {
                return "ChangePasswordDTO{" +
                        "oldPassword='******', " +
                        "newPassword='******'" +
                        '}';
        }
}
