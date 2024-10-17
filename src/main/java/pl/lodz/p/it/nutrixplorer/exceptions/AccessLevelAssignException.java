package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class AccessLevelAssignException extends BaseWebException{
    public AccessLevelAssignException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }

    public AccessLevelAssignException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.CONFLICT, cause);
    }
}
