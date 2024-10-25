package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.UUID;

public record ProductDetailsDTO(
        UUID id,
        String productName,
        String productDescription,
        Integer productQuantity,
        String unit,
        String country
) {
}
