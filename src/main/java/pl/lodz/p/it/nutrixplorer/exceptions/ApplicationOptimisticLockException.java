package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class ApplicationOptimisticLockException extends BaseWebException {
    public ApplicationOptimisticLockException(String message, String errorCode) {
        super(message, errorCode, httpStatus);
    }

    public ApplicationOptimisticLockException(String message, String errorCode, HttpStatus httpStatus, Throwable cause) {
        super(message, errorCode, httpStatus, cause);
    }
}
