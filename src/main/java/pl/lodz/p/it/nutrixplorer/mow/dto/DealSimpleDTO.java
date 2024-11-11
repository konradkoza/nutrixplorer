package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.UUID;

public record DealSimpleDTO(
        UUID id,
        String name,
        String description,
        double newPrice,
        double oldPrice,
        SellerAddressDTO seller,
        ProductSimpleDTO product
) {
}
