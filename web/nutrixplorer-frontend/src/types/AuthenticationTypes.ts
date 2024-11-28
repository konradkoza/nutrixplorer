export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};
