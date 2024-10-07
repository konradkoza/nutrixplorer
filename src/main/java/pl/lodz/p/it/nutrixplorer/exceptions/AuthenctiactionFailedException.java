package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class AuthenctiactionFailedException extends BaseWebException {

    public AuthenctiactionFailedException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED);
    }

    public AuthenctiactionFailedException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED, cause);
    }
}
