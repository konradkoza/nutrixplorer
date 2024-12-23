package pl.lodz.p.it.nutrixplorer.mok.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record ErrorResponseDTO(
        String message,
        String errorCode
) {

}
