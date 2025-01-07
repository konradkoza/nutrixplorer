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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.mok.dto.AuthenticationDTO;

import static pl.lodz.p.it.nutrixplorer.integration.AbstractContainerTests.baseUrl;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
@ExtendWith({DBUnitExtension.class, AbstractContainerTests.class})
@DataSet(value = "datasets/test-users.json", strategy = SeedStrategy.REFRESH)
public class FavouriteProductsTests implements AbstractDBRiderTests{

    public static String token;

    @LocalServerPort
    public int port;

    @BeforeEach
    public void setUp() {
        log.info("Application url: {}", baseUrl + ":" + port );

        Response responseAdmin = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .body(new AuthenticationDTO("adamkowalski@email.com", "password", "pl"))
                .post( baseUrl + ":" + port + "/auth/login")
                .then()
                .assertThat()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        token = responseAdmin.path("token");
    }

    @Test
    public void addProductToFavourites_shouldThrowNotFoundException() {
        String productId = "3b1b0c48-b79f-4119-bbd4-19f37fc7d69a";

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .post(baseUrl + ":" + port +"/favourites/product/" + productId + "/add")
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void addProductToFavourites_shouldAddProduct() {
        String productId = "3b1b0c48-b79f-4119-bbd4-19f37fc7d69f";

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .post(baseUrl + ":" + port +"/favourites/product/" + productId + "/add")
                .then()
                .statusCode(HttpStatus.OK.value());
    }



    @Test
    public void addProductToFavourites_shouldThrowProductAlreadyFavourite() {
        String productId = "0b9d8a26-19e1-4c1f-a64b-4003079c776b";

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .post(baseUrl + ":" + port +"/favourites/product/" + productId + "/add")
                .then()
                .statusCode(HttpStatus.OK.value());

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .post(baseUrl + ":" + port + "/favourites/product/" + productId + "/add")
                .then()
                .statusCode(HttpStatus.CONFLICT.value());
    }

    @Test
    void removeProductFromFavourites_shouldRemoveProduct() {
        String productId = "562dc9a9-ca76-4d04-91d8-be69782d0338";

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .delete(baseUrl + ":" + port + "/favourites/product/" + productId + "/remove")
                .then()
                .statusCode(HttpStatus.OK.value());
    }

    @Test
    void removeProductFromFavourites_shouldThrowNotFoundException() {
        String productId = "d065569f-ffff-4499-83d8-0de120566fa8";

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .delete(baseUrl + ":" + port + "/favourites/product/" + productId + "/remove")
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void removeProductFromFavourites_shouldThrowProductNotFavourite() {
        String productId = "d065569f-99b9-4499-83d8-0de120566fa8";

        RestAssured.given()
                .auth().oauth2(token)
                .contentType(ContentType.JSON)
                .when()
                .delete(baseUrl + ":" + port + "/favourites/product/" + productId + "/remove")
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }
}
