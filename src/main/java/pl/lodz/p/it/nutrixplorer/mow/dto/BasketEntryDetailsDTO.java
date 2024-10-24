package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record BasketEntryDetailsDTO(
        UUID id,
        ProductSimpleDTO product,
        BigDecimal units
) {
}
