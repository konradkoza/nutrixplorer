package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeEmailDTO(
        @Email(message = "Invalid email address")
        @NotBlank(message = "Email cannot be empty")
        @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters long")
        String newEmail
) {
    @Override
    public String toString() {
        return "ChangeEmailDTO{" +
                "newEmail='" + "*******@***" + '\'' +
                '}';
    }
}
