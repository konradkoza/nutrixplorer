package pl.lodz.p.it.nutrixplorer.mok.dto;

import java.util.List;

public record SimpleUserDTO(
        String id,
        String firstName,
        String lastName,
        String email,
        boolean oauth,
        List<String> accessLevels,
        boolean blocked
) {
}
