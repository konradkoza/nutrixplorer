package pl.lodz.p.it.nutrixplorer.mok.dto;

public record ChangePasswordDTO(
        String oldPassword,
        String newPassword
) {
}
