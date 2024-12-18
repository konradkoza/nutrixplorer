package pl.lodz.p.it.nutrixplorer.mow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateBasketDTO(
        List<BasketEntryDTO> basketEntries,
        @NotNull
        @NotBlank
        @Size(max = 60)
        String name,
        String description
) {
}
