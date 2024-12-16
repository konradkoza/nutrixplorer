package pl.lodz.p.it.nutrixplorer.mok.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record ErrorResponseDTO(
        String message,
        String errorCode
) {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoogleOauth2Payload {
        String iss;
        String azp;
        String aud;
        String sub;
        String email;
        @JsonProperty("email_verified")
        boolean emailVerified;
        @JsonProperty("at_hash")
        String atHash;
        String name;
        String picture;
        @JsonProperty("given_name")
        String givenName;
        @JsonProperty("family_name")
        String familyName;
        int iat;
        int exp;
    }
}
