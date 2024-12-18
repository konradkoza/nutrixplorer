package pl.lodz.p.it.nutrixplorer.exceptions.mow;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class BasketEntryException extends BaseWebException {

    public BasketEntryException(String message, String errorCode ) {
        super(message, errorCode, HttpStatus.BAD_REQUEST);
    }

    public BasketEntryException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.BAD_REQUEST, cause);
    }
}
