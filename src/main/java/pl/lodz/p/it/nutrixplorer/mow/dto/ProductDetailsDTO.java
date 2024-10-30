package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;
import java.util.UUID;

public record ProductDetailsDTO(
        UUID id,
        String productName,
        String productDescription,
        Integer productQuantity,
        String unit,
        String country,
        String ean,
        String packageType,
        List<ProductRatingDTO> ratings,
        ProductCompositionDTO composition,
        ProductLabelDTO label,
        ProducerDTO producer,
        PortionDTO portion,
        List<ProductIndexDTO> productIndexes,
        List<NutritionalIndexDTO> nutritionalIndexes,
        List<NutritionalValueDTO> nutritionalValues
) {
}
