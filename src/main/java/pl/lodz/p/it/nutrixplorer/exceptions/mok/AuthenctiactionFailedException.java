package pl.lodz.p.it.nutrixplorer.exceptions.mok;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class AuthenctiactionFailedException extends BaseWebException {

    public AuthenctiactionFailedException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED);
    }

    public AuthenctiactionFailedException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED, cause);
    }
}
