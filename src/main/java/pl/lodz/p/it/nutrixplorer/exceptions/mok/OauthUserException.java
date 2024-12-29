package pl.lodz.p.it.nutrixplorer.exceptions.mok;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class OauthUserException extends BaseWebException {

    public OauthUserException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.BAD_REQUEST);
    }

    public OauthUserException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.BAD_REQUEST, cause);
    }
}
