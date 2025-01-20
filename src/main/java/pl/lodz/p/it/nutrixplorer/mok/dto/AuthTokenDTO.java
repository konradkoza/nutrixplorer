package pl.lodz.p.it.nutrixplorer.mok.dto;

public record AuthTokenDTO(
        String token
) {
    @Override
    public String toString() {
        return "AuthTokenDTO{" + "token='******** " + '}';
    }
}
