package pl.lodz.p.it.nutrixplorer.mok.dto;

import java.util.List;

public record UsersPageDTO(
        List<SimpleUserDTO> users,
        int numberOfPages
) {
}
