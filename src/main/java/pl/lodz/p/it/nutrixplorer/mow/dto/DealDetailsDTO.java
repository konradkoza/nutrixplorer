package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.time.LocalDate;
import java.util.UUID;

public record DealDetailsDTO(
        UUID id,
        String name,
        String description,
        double newPrice,
        double oldPrice,
        SellerPublicDTO seller,
        ProductSimpleDTO product,
        LocalDate startDate,
        LocalDate endDate
) {
}
