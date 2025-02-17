package pl.lodz.p.it.nutrixplorer.mok.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleOauth2Response {
    @JsonProperty("access_token")
    String accessToken;
    @JsonProperty("expires_in")
    int expiresIn;
    String scope;
    @JsonProperty("token_type")
    String tokenType;
    @JsonProperty("id_token")
    String idToken;

    @Override
    public String toString() {
        return "GoogleOauth2Response{" +
                "accessToken='******** " +
        "expiresIn=" + expiresIn +
        ", scope='" + scope + '\'' +
                ", tokenType='" + tokenType + '\'' +
                ", idToken='******** " +
        '}';
    }
}
