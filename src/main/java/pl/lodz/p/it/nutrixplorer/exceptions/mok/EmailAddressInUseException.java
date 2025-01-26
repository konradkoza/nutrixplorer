package pl.lodz.p.it.nutrixplorer.exceptions.mok;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

public class EmailAddressInUseException extends BaseWebException {
    public EmailAddressInUseException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }
    public EmailAddressInUseException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.CONFLICT, cause);
    }
}
