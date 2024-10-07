package pl.lodz.p.it.nutrixplorer.mok.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;
import pl.lodz.p.it.nutrixplorer.mok.dto.ErrorResponseDTO;

@ControllerAdvice
public class GlobalAdvice {

    @ExceptionHandler(BaseWebException.class)
    public ResponseEntity<ErrorResponseDTO> handleBaseWebException(BaseWebException e) {
        return ResponseEntity.status(e.getHttpStatus())
                .body(new ErrorResponseDTO(e.getMessage(), e.getErrorCode()));
    }
}
