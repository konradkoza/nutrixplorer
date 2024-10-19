package pl.lodz.p.it.nutrixplorer.mok.dto;

import jakarta.persistence.Column;
import lombok.Setter;

public record UserDTO(
        String firstName,
        String lastName,
        String email
) {
}
