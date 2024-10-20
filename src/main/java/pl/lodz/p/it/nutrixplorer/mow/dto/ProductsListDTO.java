package pl.lodz.p.it.nutrixplorer.mow.dto;

import java.util.List;

public record ProductsListDTO(
        List<ProductSimpleDTO> products,
        int numberOfPages
) {
}
