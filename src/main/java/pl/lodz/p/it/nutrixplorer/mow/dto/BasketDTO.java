package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;
import java.util.UUID;

public record BasketDTO(
        UUID id,
        String name,
        String description,
        List<BasketEntryDetailsDTO> basketEntries
) {
}
