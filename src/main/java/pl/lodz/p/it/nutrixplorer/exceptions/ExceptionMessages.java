package pl.lodz.p.it.nutrixplorer.exceptions;

public class ExceptionMessages {
    public static final String VALIDATION_ERROR = "Validation error(s) occurred during processing the request: ";
    public static final String INVALID_IF_MATCH = "Problem with If-Match header";
    public static final String ETAG_HEADER_ERROR = "Problem with ETag header";
    public static final String OPTIMISTIC_LOCK = "Data has been modified by another user";
    public static final String DATABASE_CONNECTION_ERROR = "Database connection lost";
    public static final String INVALID_REQUEST_PARAMETER = "Request parameter invalid";

    private ExceptionMessages() {
    }
}
