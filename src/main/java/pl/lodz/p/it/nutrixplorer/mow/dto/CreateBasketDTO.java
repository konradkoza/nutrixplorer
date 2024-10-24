package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;

public record CreateBasketDTO(
        List<BasketEntryDTO> basketEntries,
        String name,
        String description
) {
}
