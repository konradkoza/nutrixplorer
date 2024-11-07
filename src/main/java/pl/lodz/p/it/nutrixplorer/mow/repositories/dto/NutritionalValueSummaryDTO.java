package pl.lodz.p.it.nutrixplorer.mow.repositories.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NutritionalValuesDTO {
    private String name;
    private String groupName;
    private Double quantity;
    private String unit;
}