package pl.lodz.p.it.nutrixplorer.exceptions.mok;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class UserRegisteringException extends BaseWebException {

    public UserRegisteringException(String message, String errorCode) {
        super(message, errorCode,  HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public UserRegisteringException(String message, String errorCode, Throwable cause) {
        super(message, errorCode,  HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
}
