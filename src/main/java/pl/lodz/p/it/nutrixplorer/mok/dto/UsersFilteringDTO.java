package pl.lodz.p.it.nutrixplorer.mok.dto;

public record UsersFilteringDTO(
        String firstName,
        String lastName,
        String email,
        String accessLevel
) {
}
