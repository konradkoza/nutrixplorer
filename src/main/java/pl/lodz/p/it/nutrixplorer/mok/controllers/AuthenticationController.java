package pl.lodz.p.it.nutrixplorer.mok.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.ErrorMessages;
import pl.lodz.p.it.nutrixplorer.mok.dto.*;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.AuthenticationService;

import java.util.Base64;

@RequiredArgsConstructor
@Controller
@RequestMapping("/auth")
@Transactional(propagation = Propagation.NEVER)
@Slf4j
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @Value("${nutrixplorer.oauth.client_id}")
    private String clientId;
    @Value("${nutrixplorer.oauth.client_secret}")
    private String clientSecret;
    @Value("${nutrixplorer.oauth.redirect_url}")
    private String redirectUrl;
    @Value("${nutrixplorer.oauth.token_url}")
    private String tokenUrl;
    @PostMapping("/login")
    public ResponseEntity<AuthTokenDTO> login(@RequestBody AuthenticationDTO authenticationDTO) throws UserNotVerifiedException, NotFoundException, UserBlockedException, AuthenctiactionFailedException {
        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.login(authenticationDTO.email(), authenticationDTO.password())));
    }

    @PostMapping("/register-client")
    public ResponseEntity<UserDTO> registerClient(@RequestBody RegisterClientDTO registerClientDTO) throws EmailAddressInUseException {
        return ResponseEntity.ok(
                UserMapper.INSTANCE.userToUserDTO(
                        authenticationService.registerClient(
                                registerClientDTO.email(), registerClientDTO.password(), registerClientDTO.firstName(), registerClientDTO.lastName()
                        )));
    }


    @PostMapping("/oauth2/token")
    public ResponseEntity<AuthTokenDTO> getOAuth2Token(@RequestBody OauthDTO oauthDTO) throws JsonProcessingException, UserBlockedException, EmailAddressInUseException, Oauth2Exception {
        String url = UriComponentsBuilder
                .fromUriString(tokenUrl)
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("code", oauthDTO.code())
                .queryParam("grant_type", "authorization_code")
                .queryParam("redirect_uri", redirectUrl)
                .build().toUriString();
        GoogleOauth2Response result = null;
        try {
            RestClient restClient = RestClient.create();
            result = restClient.post()
                    .uri(url)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(GoogleOauth2Response.class);
        } catch (Exception e) {
            throw new Oauth2Exception(ErrorMessages.OAUTH2_ERROR, MokErrorCodes.OAUTH2_ERROR);
        }
        String token = result.getIdToken();
        String[] tokenChunks = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String tokenPayload = new String(decoder.decode(tokenChunks[1]));
        ObjectMapper mapper = new ObjectMapper();
        ErrorResponseDTO.GoogleOauth2Payload payload = mapper.readValue(tokenPayload, ErrorResponseDTO.GoogleOauth2Payload.class);

        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.signInOAuth(payload)));

    }
}
