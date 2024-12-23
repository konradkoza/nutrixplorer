package pl.lodz.p.it.nutrixplorer.exceptions.mok;

import org.springframework.http.HttpStatus;
import pl.lodz.p.it.nutrixplorer.exceptions.BaseWebException;

import java.security.NoSuchAlgorithmException;

public class TokenGenerationException extends BaseWebException {
    public TokenGenerationException(String message, String errorCode, NoSuchAlgorithmException e) {
        super(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public TokenGenerationException(String message, String errorCode, HttpStatus httpStatus, Throwable cause) {
        super(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
}
