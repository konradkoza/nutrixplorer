package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LanguageDTO(
        @NotBlank(message = "Language cannot be empty.")
        @Pattern(regexp = "^(en|pl)$", message = "Language must be either 'en' or 'pl'.")
        String language
) {
}
