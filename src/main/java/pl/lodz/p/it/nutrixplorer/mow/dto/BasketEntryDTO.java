package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record BasketEntryDTO(
        UUID productId,
        BigDecimal quantity
) {
}
