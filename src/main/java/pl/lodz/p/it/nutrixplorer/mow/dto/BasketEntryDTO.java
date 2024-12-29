package pl.lodz.p.it.nutrixplorer.mow.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.UUID;

public record BasketEntryDTO(
        @NotBlank(message = "Product ID cannot be empty.")
        UUID productId,
        @NotBlank(message = "Quantity cannot be empty.")
        @DecimalMin(value = "0.0", inclusive = false, message = "Quantity must be greater than 0.")
        @DecimalMax(value = "100000", message = "Quantity must be less than or equal to 10 000.00")
        BigDecimal quantity
) {
}
