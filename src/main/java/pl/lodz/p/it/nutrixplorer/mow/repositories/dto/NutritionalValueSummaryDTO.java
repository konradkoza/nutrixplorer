package pl.lodz.p.it.nutrixplorer.mow.repositories.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NutritionalValueSummaryDTO {
    private String name;
    private String groupName;
    private Double quantity;
    private String unit;
}