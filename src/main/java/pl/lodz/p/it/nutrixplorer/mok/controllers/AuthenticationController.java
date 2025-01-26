package pl.lodz.p.it.nutrixplorer.mok.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.*;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.MowErrorMessages;
import pl.lodz.p.it.nutrixplorer.mok.dto.*;
import pl.lodz.p.it.nutrixplorer.mok.mappers.UserMapper;
import pl.lodz.p.it.nutrixplorer.mok.services.AuthenticationService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
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
    @PreAuthorize("permitAll()")
    public ResponseEntity<AuthTokenDTO> login(@RequestBody @Valid AuthenticationDTO authenticationDTO, HttpServletRequest request ) throws UserNotVerifiedException, NotFoundException, UserBlockedException, AuthenctiactionFailedException, LoginAttemptsExceededException {
        String remoteAddr = request.getRemoteAddr();
        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.login(authenticationDTO, remoteAddr)));
    }

    @PostMapping("/register-client")
    @PreAuthorize("permitAll()")
    public ResponseEntity<UserDTO> registerClient(@RequestBody @Valid RegisterClientDTO registerClientDTO) throws EmailAddressInUseException, UserRegisteringException {
        return ResponseEntity.ok(
                UserMapper.INSTANCE.userToUserDTO(
                        authenticationService.registerClient(registerClientDTO)));
    }


    @PostMapping("/oauth2/token")
    @PreAuthorize("permitAll()")
    public ResponseEntity<AuthTokenDTO> getOAuth2Token(@RequestBody OauthDTO oauthDTO, HttpServletRequest request) throws JsonProcessingException, UserBlockedException, EmailAddressInUseException, Oauth2Exception {
        String url = UriComponentsBuilder
                .fromUriString(tokenUrl)
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("code", oauthDTO.code())
                .queryParam("grant_type", "authorization_code")
                .queryParam("redirect_uri", redirectUrl)
                .build().toUriString();
        GoogleOauth2Response result;
        try {
            RestClient restClient = RestClient.create();
            result = restClient.post()
                    .uri(url)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(GoogleOauth2Response.class);
        } catch (Exception e) {
            throw new Oauth2Exception(MowErrorMessages.OAUTH2_ERROR, MokErrorCodes.OAUTH2_ERROR, e);
        }
        if (result == null) {
            throw new Oauth2Exception(MowErrorMessages.OAUTH2_ERROR, MokErrorCodes.OAUTH2_ERROR);
        }
        String remoteAddr = request.getRemoteAddr();
        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.signInOAuth(result, remoteAddr)));
    }

    @PostMapping("/activate")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Void> activateAccount(@RequestBody @Valid VerificationTokenDTO activationDTO) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
        authenticationService.activateAccount(activationDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordDTO resetPasswordDTO) throws UserNotVerifiedException, UserBlockedException, OauthUserException {
        authenticationService.resetPassword(resetPasswordDTO);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-password")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordWithTokenDTO changePasswordDTO) throws VerificationTokenInvalidException, NotFoundException, VerificationTokenExpiredException {
        authenticationService.changePassword(changePasswordDTO);
        return ResponseEntity.ok().build();
    }

}
