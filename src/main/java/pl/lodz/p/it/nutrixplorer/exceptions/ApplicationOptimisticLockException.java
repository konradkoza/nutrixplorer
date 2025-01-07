package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class ApplicationOptimisticLockException extends BaseWebException {
    public ApplicationOptimisticLockException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.PRECONDITION_FAILED);
    }

    public ApplicationOptimisticLockException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.PRECONDITION_FAILED, cause);
    }
}
