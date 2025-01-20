package pl.lodz.p.it.nutrixplorer.mok.dto;

public record OauthDTO(
        String code
) {
    @Override
    public String toString() {
        return "OauthDTO{" + "code='********" + '}';
    }
}
