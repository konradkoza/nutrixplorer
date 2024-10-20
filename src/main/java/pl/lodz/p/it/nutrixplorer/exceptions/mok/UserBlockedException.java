package pl.lodz.p.it.nutrixplorer.exceptions.mok;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class UserBlockedException extends BaseWebException {
    public UserBlockedException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.FORBIDDEN);
    }

    public UserBlockedException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.FORBIDDEN, cause);
    }
}
