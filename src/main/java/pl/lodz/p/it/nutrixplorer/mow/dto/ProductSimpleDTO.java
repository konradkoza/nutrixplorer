package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.UUID;

public record ProductSimpleDTO(
        UUID id,
        String productName,
        String productDescription,
        String productQuantity,
        UnitDTO unit

) {

}
