package pl.lodz.p.it.nutrixplorer.mok.dto;

public record AuthenticationDTO(
        String email,
        String password,
        String language
) {

    @Override
    public String toString() {
        return "AuthenticationDTO{" +
                "email='" + email + '\'' +
                ", password='********'" +
                '}';
    }
}
