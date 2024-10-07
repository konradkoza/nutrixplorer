package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class UserNotVerifiedException extends BaseWebException {
    public UserNotVerifiedException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.FORBIDDEN);
    }

    public UserNotVerifiedException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.FORBIDDEN, cause);
    }
}
