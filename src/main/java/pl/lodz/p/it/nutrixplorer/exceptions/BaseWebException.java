package pl.lodz.p.it.nutrixplorer.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BaseWebException extends Exception {
    private final String errorCode;
    private final HttpStatus httpStatus;
    public BaseWebException(String message,
                            String errorCode,
                            HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
    public BaseWebException(String message,
                            String errorCode,
                            HttpStatus httpStatus,
                            Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
