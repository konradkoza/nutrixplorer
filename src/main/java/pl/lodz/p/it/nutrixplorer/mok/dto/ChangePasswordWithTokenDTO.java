package pl.lodz.p.it.nutrixplorer.mok.dto;

public record ChangePasswordWithTokenDTO(
        String token,
        String newPassword
) {
}
