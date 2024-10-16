package pl.lodz.p.it.nutrixplorer.mok.dto;

public record RegisterSellerDTO(
        String password,
        String email,
        String firstName,
        String lastName,
        AddressDTO address
) {
}
