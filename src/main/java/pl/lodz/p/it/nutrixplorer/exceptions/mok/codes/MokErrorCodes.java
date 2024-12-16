package pl.lodz.p.it.nutrixplorer.exceptions.mok.codes;

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


    private MokErrorCodes() {
    }
}
