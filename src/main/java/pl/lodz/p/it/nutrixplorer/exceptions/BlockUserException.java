package pl.lodz.p.it.nutrixplorer.exceptions;

import org.springframework.http.HttpStatus;

public class BlockUserException extends BaseWebException{
    public BlockUserException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.CONFLICT);
    }

    public BlockUserException(String message, String errorCode, Throwable cause) {
        super(message, errorCode, HttpStatus.CONFLICT, cause);
    }
}
