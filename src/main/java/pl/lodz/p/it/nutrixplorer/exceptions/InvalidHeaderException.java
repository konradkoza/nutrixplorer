package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidHeaderException extends BaseWebException {
    public InvalidHeaderException(String message, String errorCode ) {
        super(message, errorCode, HttpStatus.BAD_REQUEST);
    }

    public InvalidHeaderException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.BAD_REQUEST, cause);
    }
}
