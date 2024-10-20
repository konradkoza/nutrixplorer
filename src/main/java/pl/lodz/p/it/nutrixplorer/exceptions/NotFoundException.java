package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseWebException {
    public NotFoundException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.NOT_FOUND);
    }

    public NotFoundException(String message, String errorCode, Throwable cause) {
        super(message,errorCode, HttpStatus.NOT_FOUND, cause);
    }
}
