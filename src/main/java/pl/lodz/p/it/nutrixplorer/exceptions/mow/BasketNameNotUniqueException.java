package pl.lodz.p.it.nutrixplorer.exceptions.mow;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class BasketNameNotUniqueException extends BaseWebException {
    public BasketNameNotUniqueException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }
    public BasketNameNotUniqueException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.CONFLICT, cause);
    }
}
