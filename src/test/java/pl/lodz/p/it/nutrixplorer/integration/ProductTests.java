package pl.lodz.p.it.nutrixplorer.integration;

import com.github.database.rider.junit5.DBUnitExtension;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductDetailsDTO;

import static org.hamcrest.Matchers.*;
import static pl.lodz.p.it.nutrixplorer.integration.AbstractContainerTests.baseUrl;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
@ExtendWith({DBUnitExtension.class, AbstractContainerTests.class})
public class ProductTests {

    @LocalServerPort
    public int port;


    @Test
    public void filterProductsByName_shouldReturnMatchingProducts() {

        RestAssured.given()
                .contentType(ContentType.JSON)
                .param("productName", "Mleko")
                .when()
                .get(baseUrl + ":" + port + "/product/filtered")
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("products", hasSize(greaterThan(0)))
                .body("products[0].productName", containsString("Mleko"));
    }

    @Test
    public void filterProductsByCountry_shouldReturnMatchingProducts() {

        RestAssured.given()
                .contentType(ContentType.JSON)
                .param("country", "Polska")
                .when()
                .get(baseUrl + ":" + port + "/product/filtered")
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("products", hasSize(greaterThan(0)));
    }

    @Test
    public void filterProductsByNutritionalValues_shouldReturnMatchingProducts() {

        RestAssured.given()
                .contentType(ContentType.JSON)
                .param("minCarbs", 10)
                .param("maxCarbs", 20)
                .when()
                .get(baseUrl + ":" + port + "/product/filtered")
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("products", hasSize(greaterThan(0)));
    }

    @Test
    public void filterProductsByNutritionalValues_shouldReturnMatchingProducts2() {

        Response productsResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .param("minCarbs", 10)
                .param("maxCarbs", 20)
                .when()
                .get(baseUrl + ":" + port + "/product")
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        String productId = productsResponse.jsonPath().getString("products[0].id");

        Response productDetailsResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/product/" + productId)
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        ProductDetailsDTO productDetails = productDetailsResponse.as(ProductDetailsDTO.class);
        Assertions.assertNotNull(productDetails.productName(), "Product name should not be null");
        double quantity = productDetails.nutritionalValues().stream().filter(
                (nutr) -> nutr.nutritionalValueName().name().equals("Total") && nutr.nutritionalValueName().group().equals("Węglowodany") ).toList().getFirst().quantity();
        Assertions.assertTrue(quantity >= 10, "Product energy should be greater than 10");
        Assertions.assertTrue(quantity <= 20, "Product carbs should be less than 20");

    }

    @Test
    public void filterProductsByVitamin_shouldReturnMatchingProducts2() {

        Response productsResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .param("vitamins", "C")
                .when()
                .get(baseUrl + ":" + port + "/product/filtered")
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        String productId = productsResponse.jsonPath().getString("products[0].id");

        Response productDetailsResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/product/" + productId)
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        ProductDetailsDTO productDetails = productDetailsResponse.as(ProductDetailsDTO.class);
        Assertions.assertNotNull(productDetails.productName(), "Product name should not be null");
        double quantity = productDetails.nutritionalValues().stream().filter(
                (nutr) -> nutr.nutritionalValueName().name().equals("Witamina C") && nutr.nutritionalValueName().group().equals("Witaminy") ).toList().getFirst().quantity();
        Assertions.assertTrue(quantity > 0, "Product energy should be greater than 0");
    }

    @Test
    public void filterProductsByMinerals_shouldReturnMatchingProducts2() {

        Response productsResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .param("minerals", "Wapń")
                .when()
                .get(baseUrl + ":" + port + "/product/filtered")
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        String productId = productsResponse.jsonPath().getString("products[0].id");

        Response productDetailsResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .when()
                .get(baseUrl + ":" + port + "/product/" + productId)
                .then()
                .statusCode(HttpStatus.OK.value())
                .extract()
                .response();
        ProductDetailsDTO productDetails = productDetailsResponse.as(ProductDetailsDTO.class);
        Assertions.assertNotNull(productDetails.productName(), "Product name should not be null");
        double quantity = productDetails.nutritionalValues().stream().filter(
                (nutr) -> nutr.nutritionalValueName().name().equals("Wapń") && nutr.nutritionalValueName().group().equals("Minerały") ).toList().getFirst().quantity();
        Assertions.assertTrue(quantity > 0, "Product energy should be greater than 0");
    }

    @Test
    public void filterProductsByDescription_shouldReturnMatchingProducts() {

        RestAssured.given()
                .contentType(ContentType.JSON)
                .param("description", "ser")
                .when()
                .get(baseUrl + ":" + port + "/product/filtered")
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("products", hasSize(greaterThan(0)))
                .body("products[0].productName", containsStringIgnoringCase("ser"));
    }
}
