package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;

public record BasketFilteringDTO(
        String minCarbs,
        String maxCarbs,
        String minFat,
        String maxFat,
        String minProtein,
        String maxProtein,
        String minFiber,
        String maxFiber,
        String minEnergy,
        String maxEnergy,
        List<String> vitamins,
        List<String> minerals,
        List<String> allergens,
        String sort,
        String name

) {

}
