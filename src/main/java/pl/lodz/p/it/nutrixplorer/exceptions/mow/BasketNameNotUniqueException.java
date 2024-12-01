package pl.lodz.p.it.nutrixplorer.exceptions.mow;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class BasketNameNotUniqueException extends BaseWebException {

    public BasketNameNotUniqueException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.BAD_REQUEST);
    }

    public BasketNameNotUniqueException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.BAD_REQUEST, cause);
    }
}
