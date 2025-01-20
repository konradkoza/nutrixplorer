package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.NotBlank;

public record VerificationTokenDTO(
        @NotBlank(message = "Token cannot be empty")
        String token
) {
    @Override
    public String toString() {
            return "VerificationTokenDTO{" + "token='******** " + '}';
    }
}
