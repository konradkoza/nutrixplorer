export type UserPersonalData = {
    firstName: string;
    lastName: string;
    email: string;
};

export enum AccessLevel {
    GUEST = "GUEST",
    CLIENT = "CLIENT",
    SELLER = "SELLER",
    ADMINISTRATOR = "ADMINISTRATOR",
}
