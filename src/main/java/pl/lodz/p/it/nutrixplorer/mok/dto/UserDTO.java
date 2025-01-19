package pl.lodz.p.it.nutrixplorer.mok.dto;

public record UserDTO(
        String firstName,
        String lastName,
        String email,
        boolean oauth
) {
}
