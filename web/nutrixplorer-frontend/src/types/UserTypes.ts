export type UserPersonalData = {
    firstName: string;
    lastName: string;
    email: string;
    oauth: boolean;
    language?: "pl" | "en";
};

export enum AccessLevel {
    GUEST = "GUEST",
    CLIENT = "CLIENT",
    SELLER = "SELLER",
    ADMINISTRATOR = "ADMINISTRATOR",
}

export type SimpleUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    oauth: boolean;
    accessLevels: AccessLevel[];
    blocked: boolean;
};

export type UsersPage = {
    users: SimpleUser[];
    numberOfPages: number;
};

export type UserFilters = {
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    accessLevel: AccessLevel | undefined;
};

export type UserDetails = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    oauth: boolean;
    accessLevels: AccessLevel[];
    blocked: boolean;
    verified: boolean;
    language: "pl" | "en";
    loginAttempts: number;
    lastSuccessfulLogin: string;
    lastFailedLogin: string;
    lastSuccessfulLoginIp: string;
    lastFailedLoginIp: string;
};
