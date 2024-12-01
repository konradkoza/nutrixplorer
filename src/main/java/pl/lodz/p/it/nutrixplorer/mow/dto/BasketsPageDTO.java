package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;

public record BasketsPageDTO(
        List<BasketDTO> baskets,
        int numberOfPages
) {
}
