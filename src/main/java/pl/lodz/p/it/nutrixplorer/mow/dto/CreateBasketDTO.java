package pl.lodz.p.it.nutrixplorer.mow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateBasketDTO(
        @NotBlank(message = "Name cannot be empty.")
        @Size(min = 3, max = 60, message = "Name must be between 3 and 60 characters long.")
        String name,
        @Size(max = 2000, message = "Description must be less than 2000 characters long.")
        String description
) {
}
