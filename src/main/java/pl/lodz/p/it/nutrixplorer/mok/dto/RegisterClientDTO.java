package pl.lodz.p.it.nutrixplorer.mok.dto;

public record RegisterClientDTO(
        String password,
        String email,
        String firstName,
        String lastName,
        String language) {
}
