package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class EmailAddressInUseException extends BaseWebException{
    public EmailAddressInUseException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }

    public EmailAddressInUseException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.CONFLICT, cause);
    }
}
