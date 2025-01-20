package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterClientDTO(
        @NotBlank(message = "First name cannot be empty")
        @Size(min = 1, max = 50, message = "First name length must be between 1 and 50")
        String firstName,
        @NotBlank(message = "Last name cannot be empty")
        @Size(min = 1, max = 50, message = "First name length must be between 1 and 50")
        String lastName,
        @Email(message = "Invalid email address")
        @NotBlank(message = "Email cannot be empty")
        @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters long")
        String email,
        @NotBlank(message = "Password cannot be empty")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters long")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character"
        )
        String password,
        @NotBlank(message = "Language cannot be empty")
        @Pattern(regexp = "^(en|pl)$", message = "Language must be either 'en' or 'pl'")
        String language
) {

    @Override
    public String toString() {
        return "RegisterClientDTO{" +
                "firstName='" + "******" + '\'' +
                ", lastName='" + "******" + '\'' +
                ", email='" + "******" + '\'' +
                ", password='********'" +
                ", language='" + language + '\'' +
                '}';
    }
}
