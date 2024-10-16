package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class UserVerificationException extends BaseWebException{
    public UserVerificationException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }

    public UserVerificationException(String message, String errorCode, Throwable cause) {
        super(message, errorCode,HttpStatus.CONFLICT, cause);
    }
}
