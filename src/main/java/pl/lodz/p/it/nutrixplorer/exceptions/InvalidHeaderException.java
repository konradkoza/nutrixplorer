package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class DataConsistencyException extends BaseWebException {
    public DataConsistencyException(String message, String errorCode ) {
        super(message, errorCode, HttpStatus.BAD_REQUEST);
    }

    public DataConsistencyException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.BAD_REQUEST, cause);
    }
}
