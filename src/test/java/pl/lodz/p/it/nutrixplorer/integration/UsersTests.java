package pl.lodz.p.it.nutrixplorer.integration;

import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.core.api.dataset.SeedStrategy;
import com.github.database.rider.junit5.DBUnitExtension;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.mok.dto.*;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AccountVerificationTokenRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.EmailVerificationTokenRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.PasswordVerificationTokenRepository;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static pl.lodz.p.it.nutrixplorer.integration.AbstractContainerTests.baseUrl;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
@ExtendWith({DBUnitExtension.class, AbstractContainerTests.class})

public class UsersTests implements AbstractDBRiderTests{

    public static String token;


    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private PasswordVerificationTokenRepository passwordVerificationTokenRepository;

    @Autowired
    private AccountVerificationTokenRepository accountVerificationTokenRepository;

    @LocalServerPort
    public int port;

    @BeforeEach
    @DataSet(value = "datasets/test-users.json", strategy = SeedStrategy.REFRESH)
    public void setUp() {
        Response responseAdmin = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("alicejohnson@email.com", "password", "pl"))
                .post( baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        token = responseAdmin.path("token");
    }

    @Test
    public void testLogin() {
        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("janesmith@email.com", "password", "en"))
                .post(baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();

        String token = response.path("token");
        assertNotNull(token);
    }

    @Test
    @Transactional(transactionManager = "mokTransactionManager")
    public void testRegisterClient() {
        RegisterClientDTO registerClientDTO = new RegisterClientDTO("John", "Doe", "newuser@example.com", "P@ssw0rd", "en");

        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(registerClientDTO)
                .post(baseUrl + ":" + port + "/auth/register-client")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();

        assertEquals("newuser@example.com", response.path("email"), "Email should be the same");


        RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("newuser@example.com", "P@ssw0rd", "en"))
                .post(baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.FORBIDDEN.value());
        String token = accountVerificationTokenRepository.findByUserEmail(response.path("email")).get().getToken();
        RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new VerificationTokenDTO(token))
                .post(baseUrl + ":" + port + "/auth/activate")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());


        RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("newuser@example.com", "P@ssw0rd", "en"))
                .post(baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());
    }


    @Test
    public void testBlockUser() {
        RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .when()
                .patch(baseUrl + ":" + port + "/users/" + "ba537227-d54f-42b3-aa58-10492cddf8a6" + "/block")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());


        RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("adamkowalski3@email.com", "password", "pl"))
                .post(baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.FORBIDDEN.value());

        RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .when()
                .delete(baseUrl + ":" + port + "/users/" + "ba537227-d54f-42b3-aa58-10492cddf8a6" + "/block")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());

        RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("adamkowalski3@email.com", "password", "pl"))
                .post(baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());
    }

    @Test
    public void testChangeUserName() {
        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .when()
                .get(baseUrl + ":" + port + "/users/" + "ba537227-d54f-42b3-aa58-10492cddf8a6")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();

        String etag = response.header("ETag");

        RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .header("If-Match", etag.substring(1, etag.length()-1))
                .body("{\"firstName\":\"Adam\", \"lastName\":\"Kowalski\"}")
                .when()
                .patch(baseUrl + ":" + port + "/users/" + "ba537227-d54f-42b3-aa58-10492cddf8a6" + "/name")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());

        Response response2 = RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .when()
                .get(baseUrl + ":" + port + "/users/" + "ba537227-d54f-42b3-aa58-10492cddf8a6")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();

        assertEquals("Adam", response2.path("firstName"));
        assertEquals("Kowalski", response2.path("lastName"));
    }

    @Test
    public void testChangeUserPassword() {

        RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .when()
                .body(new ChangePasswordDTO("password", "newP@ssw0rd"))
                .patch(baseUrl + ":" + port + "/me/change-password")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());

        Response responseAdmin = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("alicejohnson@email.com", "newP@ssw0rd", "pl"))
                .post( baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        String newToken = responseAdmin.path("token");
        assertNotNull(newToken);
    }

    @Test
    @Transactional(transactionManager = "mokTransactionManager")
    public void testChangeEmail() {
        RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .when()
                .body(new ChangeEmailDTO("alicenewmail@email.com"))
                .patch(baseUrl + ":" + port + "/me/change-email-init")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());

        String verificationToken  = emailVerificationTokenRepository.findByUserId(UUID.fromString("f4c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e")).get().getToken();

        RestAssured.given()
                .contentType(ContentType.JSON)
                .auth().oauth2(token)
                .when()
                .body(new ConfirmEmailChangeDTO(verificationToken))
                .patch(baseUrl + ":" + port + "/me/change-email")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());

        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("alicenewmail@email.com", "password", "en"))
                .post(baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();

        String newToken = response.path("token");
        assertNotNull(newToken);
    }

    @Test
    @Transactional(transactionManager = "mokTransactionManager")
    public void testResetPassword() {
        RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new ResetPasswordDTO("janesmith@email.com"))
                .post(baseUrl + ":" + port + "/auth/reset-password")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());

        String verificationToken = passwordVerificationTokenRepository.findByUserEmail("janesmith@email.com").get().getToken();

        RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new ChangePasswordWithTokenDTO(verificationToken, "newpassword"))
                .patch(baseUrl + ":" + port + "/auth/change-password")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value());

        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("janesmith@email.com", "newpassword", "en"))
                .post(baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();

        String newToken = response.path("token");
        assertNotNull(newToken);
    }


}
