package pl.lodz.p.it.nutrixplorer.mok.dto;

public record RegisterSelletDTO(
        String password,
        String email,
        String firstName,
        String lastName,
        AddressDTO address
) {
}
