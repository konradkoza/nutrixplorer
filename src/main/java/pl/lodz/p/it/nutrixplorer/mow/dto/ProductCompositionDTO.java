package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;
import java.util.UUID;

public record ProductCompositionDTO(
        UUID id,
        List<String> ingredients,
        List<String> additions,
        String flavour
) {
}
