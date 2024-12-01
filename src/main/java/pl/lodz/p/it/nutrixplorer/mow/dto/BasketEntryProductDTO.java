package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;
import java.util.UUID;

public record BasketEntryProductDTO(
        UUID id,
        String productName,
        String productDescription,
        Integer productQuantity,
        String unit,
        List<NutritionalValueDTO> nutritionalValues,
        List<String> allergenList
) {
}
