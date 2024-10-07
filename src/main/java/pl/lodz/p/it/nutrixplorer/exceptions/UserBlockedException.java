package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class UserBlockedException extends BaseWebException {
    public UserBlockedException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.FORBIDDEN);
    }

    public UserBlockedException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.FORBIDDEN, cause);
    }
}
