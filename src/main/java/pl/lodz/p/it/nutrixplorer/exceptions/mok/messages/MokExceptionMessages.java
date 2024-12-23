package pl.lodz.p.it.nutrixplorer.exceptions.mok.messages;

public class MokExceptionMessages {


    public static final String CLIENT_NOT_FOUND = "Client not found";
    public static final String SELLER_NOT_FOUND = "Seller not found";
    public static final String OAUTH_EMAIL_IN_USE = "Email is already used, use email and password to log in";
    public static final String TOKEN_GENERATION_ERROR = "Token generation error";
    public static final String VERIFICATION_TOKEN_INVALID = "Verification token invalid";
    public static final String VERIFICATION_TOKEN_EXPIRED = "Verification token expired";
    public static final String UNEXPECTED_ROLLBACK = "Unexpected rollback";
    public static final String UNEXPECTED_ERROR = "Unexpected error";

    private MokExceptionMessages() {
    }

    public static final String NOT_FOUND = "User not found";
    public static final String INVALID_CREDENTIALS = "Invalid credentials";
    public static final String UNVERIFIED_ACCOUNT = "Unverified account";
    public static final String ACCOUNT_BLOCKED = "Account blocked";
    public static final String EMAIL_IN_USE = "Email is already used";
    public static final String USER_BLOCKED = "User is already blocked";
    public static final String USER_UNBLOCKED = "User is already unblocked";
    public static final String USER_VERIFIED = "User is already verified";
    public static final String ACCESS_LEVEL_ASSIGNED = "Access level already assigned";
    public static final String ACCESS_LEVEL_TAKEN = "Access level already taken";
    public static final String ACCESS_LEVEL_CANNOT_BE_REMOVED = "Access level cannot be removed, user has only one access level";
    public static final String OWN_ADMINISTRATOR_ROLE_REMOVAL = "Cannot remove own administrator role";
    public static final String OAUTH2_USER = "User registered with Google, use Google Sign In or reset password";
}
