package pl.lodz.p.it.nutrixplorer.mok.dto;

public record AuthenticationDTO(
        String email,
        String password
) {

    @Override
    public String toString() {
        return "AuthenticationDTO{" +
                "email='" + email + '\'' +
                ", password='********'" +
                '}';
    }
}
