package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;

public record DealPageDTO(
        List<DealSimpleDTO> deals,
        int numberOfPages
) {
}
