package pl.lodz.p.it.nutrixplorer.integration;

import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.core.api.dataset.SeedStrategy;
import com.github.database.rider.junit5.DBUnitExtension;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.mok.dto.AuthenticationDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketEntryDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.CreateBasketDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.UpdateEntryDTO;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static pl.lodz.p.it.nutrixplorer.integration.AbstractContainerTests.baseUrl;

@Slf4j
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith({DBUnitExtension.class, AbstractContainerTests.class})
public class BasketTests implements AbstractDBRiderTests{

    public static String token;

    @LocalServerPort
    public int port;

    @BeforeEach
    @DataSet(value = "datasets/test-baskets.json", strategy = SeedStrategy.REFRESH)
    public void setUp() {
        log.info("Application url: {}", baseUrl + ":" + port );

        Response responseAdmin = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("adamkowalski2@email.com", "password", "pl"))
                .post( baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        token = responseAdmin.path("token");
    }

    @Test
    public void getBasketTest_ReturnsBasketWithEntries(){

        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port +"/basket/" + basketId)
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("basketEntries.size()", is(3));
    }

    @Test
    public void addEntryToBasket_shouldIncreaseNumberOfEntries() {
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        String productId = "bd19a5cc-a263-4909-b0be-73515f8d05c1";
        int initialEntriesCount = RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .extract()
                .path("basketEntries.size()");

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new BasketEntryDTO(UUID.fromString(productId), BigDecimal.valueOf(100)))
                .when()
                .post(baseUrl + ":" + port + "/basket/" + basketId + "/entry")
                .then()
                .statusCode(HttpStatus.OK.value());

        int updatedEntriesCount = RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .extract()
                .path("basketEntries.size()");

        Assertions.assertEquals(initialEntriesCount + 1, updatedEntriesCount);
    }

    @Test
    public void addEntryToBasket_productAlreadyInBasketReturnsBadRequest(){
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        String productId = "f0587269-3d6e-44b5-a416-e4659c8a18a7";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new BasketEntryDTO(UUID.fromString(productId), BigDecimal.valueOf(100)))
                .when()
                .post(baseUrl + ":" + port + "/basket/" + basketId + "/entry")
                .then()
                .statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void addEntryToBasket_shouldThrowNotFoundException() {
        String basketId = "b287334b-ffff-411d-95b6-a2d18d98f9af";
        String productId = "f0587269-3d6e-44b5-a416-e4659c8a18a7";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new BasketEntryDTO(UUID.fromString(productId), BigDecimal.valueOf(100)))
                .when()
                .post(baseUrl + ":" + port + "/basket/" + basketId + "/entry")
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void removeEntryFromBasket_shouldDecreaseNumberOfEntries() {
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        String entryId = "b287334b-235e-411d-95b6-a2d18d98f9af";
        int initialEntriesCount = RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .extract()
                .path("basketEntries.size()");

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .delete(baseUrl + ":" + port + "/basket/entry/" + entryId)
                .then()
                .statusCode(HttpStatus.OK.value());

        int updatedEntriesCount = RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .extract()
                .path("basketEntries.size()");

        Assertions.assertEquals(initialEntriesCount - 1, updatedEntriesCount);
    }

    @Test
    public void removeEntryFromBasket_shouldThrowNotFoundException() {
        String entryId = "b287334b-ffff-411d-95b6-a2d18d98f9af";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .delete(baseUrl + ":" + port + "/basket/entry/" + entryId)
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void createBasket_shouldCreateBasket() {
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new CreateBasketDTO("New basket3", "New basket description"))
                .when()
                .post(baseUrl + ":" + port + "/basket")
                .then()
                .statusCode(HttpStatus.CREATED.value());
    }

    @Test
    public void removeBasket_shouldRemoveBasket() {
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .delete(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .statusCode(HttpStatus.OK.value());
    }

    @Test
    public void removeBasket_shouldThrowNotFoundException() {
        String basketId = "b287334b-ffff-411d-95b6-a2d18d98f9af";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .delete(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void updateBasketEntry_shouldUpdateEntry() {
        String entryId = "10518432-d732-43f2-a0b2-2da2153162f4";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new UpdateEntryDTO(BigDecimal.valueOf(200)))
                .when()
                .patch(baseUrl + ":" + port + "/basket/entry/" + entryId)
                .then()
                .statusCode(HttpStatus.OK.value());
    }

    @Test
    public void updateBasketEntry_shouldThrowNotFoundException() {
        String entryId = "b287334b-ffff-411d-95b6-a2d18d98f9af";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new UpdateEntryDTO(BigDecimal.valueOf(200)))
                .when()
                .patch(baseUrl + ":" + port + "/basket/entry/" + entryId)
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void modifyNotOwnEntry_shouldThrowNotFoundException() {
        String entryId = "5495e63c-9187-45dc-ba71-552d3d131410";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new UpdateEntryDTO(BigDecimal.valueOf(200)))
                .when()
                .patch(baseUrl + ":" + port + "/basket/entry/" + entryId)
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void createBasket_shouldThrowBasketNameNotUniqueException() {
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new CreateBasketDTO("Test basket", "Basket description"))
                .when()
                .post(baseUrl + ":" + port + "/basket")
                .then()
                .statusCode(HttpStatus.CONFLICT.value());
    }

    @Test
    public void createBasketWithEmptyName_ShouldReturnBadRequest(){
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new CreateBasketDTO("", "Basket description"))
                .when()
                .post(baseUrl + ":" + port + "/basket")
                .then()
                .statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void updateBasketWithExistingName_ShouldReturnConflict(){
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";

        String basketEtag = RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .extract().header("ETag");

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .header("If-Match", basketEtag.substring(1, basketEtag.length()-1))
                .body(new CreateBasketDTO("Test basket1", "Basket description"))
                .when()
                .patch(baseUrl + ":" + port + "/basket/" + basketId)
                .then()
                .statusCode(HttpStatus.CONFLICT.value());
    }

    @Test
    public void createEntryWithNegativeQuantity_ShouldReturnBadRequest(){
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        String productId = "f0587269-3d6e-44b5-a416-e4659c8a18a7";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new BasketEntryDTO(UUID.fromString(productId), BigDecimal.valueOf(-100)))
                .when()
                .post(baseUrl + ":" + port + "/basket/" + basketId + "/entry")
                .then()
                .statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void updateEntryWithNegativeQuantity_ShouldReturnBadRequest(){
        String entryId = "10518432-d732-43f2-a0b2-2da2153162f4";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new UpdateEntryDTO(BigDecimal.valueOf(-200)))
                .when()
                .patch(baseUrl + ":" + port + "/basket/entry/" + entryId)
                .then()
                .statusCode(HttpStatus.BAD_REQUEST.value());
    }


    @Test
    public void copyBasket_shouldCopyBasket() {
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        int initialBasketsCount = RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/basket/user")
                .then()
                .extract()
                .path("size()");

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new CreateBasketDTO("New basket1", "New basket description"))
                .when()
                .post(baseUrl + ":" + port + "/basket/" + basketId + "/copy")
                .then()
                .statusCode(HttpStatus.CREATED.value());

        int updatedBasketsCount = RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/basket/user")
                .then()
                .extract()
                .path("size()");

        Assertions.assertEquals(initialBasketsCount + 1, updatedBasketsCount);
    }

    @Test
    public void copyBasket_shouldThrowNotFoundException() {
        String basketId = "b287334b-ffff-411d-95b6-a2d18d98f9af";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new CreateBasketDTO("New basket2", "New basket description"))
                .when()
                .post(baseUrl + ":" + port + "/basket/" + basketId + "/copy")
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void copyBasket_shouldThrowBasketNameNotUniqueException() {
        String basketId = "258c1a98-6ac8-4e7a-b670-833433750bcc";
        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .body(new CreateBasketDTO("Test basket", "Basket description"))
                .when()
                .post(baseUrl + ":" + port + "/basket/" + basketId + "/copy")
                .then()
                .statusCode(HttpStatus.CONFLICT.value());
    }



}
