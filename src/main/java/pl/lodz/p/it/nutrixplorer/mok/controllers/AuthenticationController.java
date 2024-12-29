package pl.lodz.p.it.nutrixplorer.mok.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
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
import pl.lodz.p.it.nutrixplorer.utils.PasswordHolder;

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
    public ResponseEntity<AuthTokenDTO> login(@RequestBody @Valid AuthenticationDTO authenticationDTO) throws UserNotVerifiedException, NotFoundException, UserBlockedException, AuthenctiactionFailedException, LoginAttemptsExceededException {
        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.login(authenticationDTO.email(), new PasswordHolder(authenticationDTO.password()), authenticationDTO.language())));
    }

    @PostMapping("/register-client")
    public ResponseEntity<UserDTO> registerClient(@RequestBody @Valid RegisterClientDTO registerClientDTO) throws EmailAddressInUseException, UserRegisteringException {
        return ResponseEntity.ok(
                UserMapper.INSTANCE.userToUserDTO(
                        authenticationService.registerClient(
                                registerClientDTO.email(), new PasswordHolder(registerClientDTO.password()), registerClientDTO.firstName(), registerClientDTO.lastName(), registerClientDTO.language()
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
        GoogleOauth2Response result;
        try {
            RestClient restClient = RestClient.create();
            result = restClient.post()
                    .uri(url)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(GoogleOauth2Response.class);
        } catch (Exception e) {
            throw new Oauth2Exception(ErrorMessages.OAUTH2_ERROR, MokErrorCodes.OAUTH2_ERROR, e);
        }
        if (result == null) {
            throw new Oauth2Exception(ErrorMessages.OAUTH2_ERROR, MokErrorCodes.OAUTH2_ERROR);
        }
        return ResponseEntity.ok(new AuthTokenDTO(authenticationService.signInOAuth(result)));
    }

    @PostMapping("/activate")
    public ResponseEntity<Void> activateAccount(@RequestBody @Valid VerificationTokenDTO activationDTO) throws VerificationTokenInvalidException, VerificationTokenExpiredException, NotFoundException {
        authenticationService.activateAccount(activationDTO.token());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordDTO resetPasswordDTO) throws UserNotVerifiedException, UserBlockedException, OauthUserException {
        authenticationService.resetPassword(resetPasswordDTO.email());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordWithTokenDTO changePasswordDTO) throws VerificationTokenInvalidException, NotFoundException, VerificationTokenExpiredException {
        authenticationService.changePassword(changePasswordDTO.token(), new PasswordHolder(changePasswordDTO.newPassword()));
        return ResponseEntity.ok().build();
    }

}
