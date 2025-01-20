package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfirmEmailChangeDTO(
        @NotBlank(message = "Token cannot be empty")
        String token
) {
    @Override
    public String toString() {
            return "ConfirmEmailChangeDTO{" + "token='********" + '}';
    }
}
