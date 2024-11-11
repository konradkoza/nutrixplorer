package pl.lodz.p.it.nutrixplorer.mow.dto;

public record PublicAddressDTO(
        String country,
        String city,
        String street,
        String number,
        String zip,
        String shopName
) {
}
