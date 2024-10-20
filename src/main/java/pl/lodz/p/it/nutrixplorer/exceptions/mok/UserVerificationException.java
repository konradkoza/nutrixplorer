package pl.lodz.p.it.nutrixplorer.exceptions.mok;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class UserVerificationException extends BaseWebException {
    public UserVerificationException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }

    public UserVerificationException(String message, String errorCode, Throwable cause) {
        super(message, errorCode,HttpStatus.CONFLICT, cause);
    }
}
