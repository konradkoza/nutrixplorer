package pl.lodz.p.it.nutrixplorer.mow.dto;

public record NutritionalValueDTO(
        NutritionalValueNameDTO nutritionalValueName,
        Double quantity,
        String unit,
        Double nrv
) {
}
