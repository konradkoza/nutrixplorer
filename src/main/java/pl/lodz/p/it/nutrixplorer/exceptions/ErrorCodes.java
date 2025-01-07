package pl.lodz.p.it.nutrixplorer.exceptions;

public class ErrorCodes {
    public static final String VALIDATION_ERROR = "validationError";
    public static final String INVALID_IF_MATCH = "invalidIfMatch";
    public static final String ETAG_HEADER_ERROR = "etagHeaderError";
    public static final String OPTIMISTIC_LOCK = "optimisticLock";
    public static final String DATABASE_CONNECTION_ERROR = "databaseConnectionError";
    public static final String INVALID_REQUEST_PARAMETER = "invalidRequestParam";
    public static final String AUTHORIZATION_DENIED = "authorizationDenied";

    private ErrorCodes() {
    }
}
