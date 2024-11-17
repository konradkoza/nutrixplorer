package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;

public record ProductsFilteringDTO(
        String productName,
        String description,
        String ean,
        String country,
        Integer minCarbs,
        Integer maxCarbs,
        Integer minFat,
        Integer maxFat,
        Integer minProtein,
        Integer maxProtein,
        Integer minFiber,
        Integer maxFiber,
        Integer minEnergy,
        Integer maxEnergy,
        List<String> vitamins,
        List<String> minerals
) {
}
