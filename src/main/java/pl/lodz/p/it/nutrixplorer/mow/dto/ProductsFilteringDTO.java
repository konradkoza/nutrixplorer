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
        Integer minSalt,
        Integer maxSalt,
        Integer minSugar,
        Integer maxSugar,
        Integer minSaturatedFat,
        Integer maxSaturatedFat,
        List<String> vitamins,
        List<String> minerals,
        List<String> allergens,
        Integer minIndexT,
        Integer minIndexS,
        Integer minIndexE,
        Integer minIndexV,
        Integer minIndexM,
        Integer minIndexO,
        Integer minIndexP,
        Integer minIndexF,
        String packageType
) {
}
