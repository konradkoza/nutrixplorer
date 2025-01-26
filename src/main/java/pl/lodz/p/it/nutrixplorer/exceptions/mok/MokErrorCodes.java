package pl.lodz.p.it.nutrixplorer.exceptions.mok;

public class MokErrorCodes {


    public static final String CLIENT_NOT_FOUND = "clientNotFound";
    public static final String OAUTH_EMAIL_IN_USE = "oauthEmailInUse";
    public static final String OAUTH2_ERROR = "oauth2AuthenticationError";
    public static final String USER_NOT_FOUND = "userNotFound";
    public static final String INVALID_CREDENTIALS = "invalidCredentials";
    public static final String UNVERIFIED_ACCOUNT = "unverifiedAccount";
    public static final String ACCOUNT_BLOCKED = "blockedAccount";
    public static final String EMAIL_IN_USE = "emailInUse";
    public static final String USER_BLOCKED = "userBlocked";
    public static final String USER_UNBLOCKED = "userUnblocked";
    public static final String USER_VERIFIED = "userVerified";
    public static final String ACCESS_LEVEL_ASSIGNED = "accessLevelAlreadyAssigned";
    public static final String ACCESS_LEVEL_TAKEN = "accessLevelAlreadyTaken";
    public static final String ACCESS_LEVEL_CANNOT_BE_REMOVED = "accessLevelCannotBeRemoved";
    public static final String ADMINISTRATOR_OWN_ROLE_REMOVAL = "ownAdministratorRoleRemoval";
    public static final String OAUTH2_USER = "oauth2User";
    public static final String TOKEN_GENERATION_ERROR = "tokenGenerationError";
    public static final String VERIFICATION_TOKEN_INVALID = "verificationTokenInvalid";
    public static final String VERIFICATION_TOKEN_EXPIRED = "verificationTokenExpired";
    public static final String UNEXPECTED_ROLLBACK = "unexpectedRollback";
    public static final String UNEXPECTED_ERROR = "unexpectedError";
    public static final String SIGN_IN_BLOCKED = "signInBlocked";
    public static final String CANNOT_BLOCK_YOURSELF = "cannotBlockYourself";
    public static final String OAUTH2_USER_PASSWORD = "oauth2UserPassword";


    private MokErrorCodes() {
    }
}
