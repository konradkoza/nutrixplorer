package pl.lodz.p.it.nutrixplorer.mok.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.BasketNameNotUniqueException;
import pl.lodz.p.it.nutrixplorer.mok.dto.ErrorResponseDTO;

@Slf4j
@ControllerAdvice
public class GlobalAdvice {

    @ExceptionHandler(BaseWebException.class)
    public ResponseEntity<ErrorResponseDTO> handleBaseWebException(BaseWebException e) {
        return ResponseEntity.status(e.getHttpStatus())
                .body(new ErrorResponseDTO(e.getMessage(), e.getErrorCode()));
    }

    @ExceptionHandler(UnexpectedRollbackException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnexpectedRollbackException(UnexpectedRollbackException e) {
        log.error("Unexpected rollback exception", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDTO(MokExceptionMessages.UNEXPECTED_ROLLBACK, MokErrorCodes.UNEXPECTED_ROLLBACK));
    }

    @ExceptionHandler(Error.class)
    public ResponseEntity<ErrorResponseDTO> handleUnexpectedError(Error e) {
        log.error("Unexpected error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDTO(MokExceptionMessages.UNEXPECTED_ERROR, MokErrorCodes.UNEXPECTED_ERROR));
    }


}
