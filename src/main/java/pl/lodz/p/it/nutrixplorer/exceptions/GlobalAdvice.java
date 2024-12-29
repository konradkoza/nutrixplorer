package pl.lodz.p.it.nutrixplorer.exceptions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mok.dto.ErrorResponseDTO;

@Slf4j
@ControllerAdvice
public class GlobalAdvice {

    @ExceptionHandler(BaseWebException.class)
    public ResponseEntity<ErrorResponseDTO> handleBaseWebException(BaseWebException e) {
        log.error("Base web exception", e);
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

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ErrorResponseDTO> handleJakartaConstraintViolationException(ConstraintViolationException e) {
        StringBuilder sb = new StringBuilder();
        for (ConstraintViolation<?> error : e.getConstraintViolations()) {
            sb.append(error.getMessage()).append(", ");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO(ExceptionMessages.VALIDATION_ERROR + sb, ErrorCodes.VALIDATION_ERROR));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorResponseDTO> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        StringBuilder sb = new StringBuilder();
        for (FieldError error : e.getFieldErrors()) {
            sb.append(error.getDefaultMessage()).append(", ");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO(ExceptionMessages.VALIDATION_ERROR + sb, ErrorCodes.VALIDATION_ERROR));
    }


}
