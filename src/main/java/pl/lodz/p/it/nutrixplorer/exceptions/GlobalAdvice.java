package pl.lodz.p.it.nutrixplorer.exceptions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.JDBCConnectionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mok.dto.ErrorResponseDTO;

import java.net.ConnectException;

@Slf4j
@ControllerAdvice
public class GlobalAdvice {

    @ExceptionHandler(BaseWebException.class)
    public ResponseEntity<ErrorResponseDTO> handleBaseWebException(BaseWebException e) {
        log.error("Base web exception caught", e);
        return ResponseEntity.status(e.getHttpStatus())
                .body(new ErrorResponseDTO(e.getMessage(), e.getErrorCode()));
    }

    @ExceptionHandler(UnexpectedRollbackException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnexpectedRollbackException(UnexpectedRollbackException e) {
        log.error("Unexpected rollback exception", e);
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponseDTO(MokExceptionMessages.UNEXPECTED_ROLLBACK, MokErrorCodes.UNEXPECTED_ROLLBACK));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleUnexpectedError(Exception e) {
        log.error("Unexpected exception", e);
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

    @ExceptionHandler(ConnectException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnexpectedRollbackException(ConnectException e) {
        log.error("Database connection lost", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDTO(ExceptionMessages.DATABASE_CONNECTION_ERROR,  ErrorCodes.DATABASE_CONNECTION_ERROR));
    }

    @ExceptionHandler(JDBCConnectionException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnexpectedRollbackException(JDBCConnectionException e) {
        log.error("Database connection lost", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDTO(ExceptionMessages.DATABASE_CONNECTION_ERROR, ErrorCodes.DATABASE_CONNECTION_ERROR));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("Database connection lost", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDTO(ExceptionMessages.INVALID_REQUEST_PARAMETER, ErrorCodes.INVALID_REQUEST_PARAMETER));
    }

    @ExceptionHandler(CannotCreateTransactionException.class)
    public ResponseEntity<ErrorResponseDTO> handleCannotCreateTransactionException(CannotCreateTransactionException e) {
        log.error("Database connection lost", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDTO(ExceptionMessages.DATABASE_CONNECTION_ERROR, ErrorCodes.DATABASE_CONNECTION_ERROR));
    }

//    AuthorizationDeniedException
    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAuthorizationDeniedException(AuthorizationDeniedException e) {
        log.error("Authorization denied", e);
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponseDTO(e.getMessage(), ErrorCodes.AUTHORIZATION_DENIED));
    }


}
