import { AccessLevel } from "./UserTypes";

export type AuthState = {
    user: string;
    accessLevels: AccessLevel[];
    token: string;
};
