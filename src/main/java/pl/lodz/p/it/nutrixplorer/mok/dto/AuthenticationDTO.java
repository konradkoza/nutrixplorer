package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AuthenticationDTO(
        @Email(message = "Invalid email address")
        @NotBlank(message = "Email cannot be empty")
        @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters long")
        String email,
        @NotBlank(message = "Password cannot be empty")
        String password,
        @NotBlank(message = "Language cannot be empty")
        @Pattern(regexp = "^(en|pl)$", message = "Language must be either 'en' or 'pl'")
        String language
) {

    @Override
    public String toString() {
        return "AuthenticationDTO{" +
                "email='" + "*******@***" + '\'' +
                ", password='********'" +
                ", language='" + language + '\'' +
                '}';
    }
}
