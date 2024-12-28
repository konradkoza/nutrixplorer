export type LoginRequest = {
    email: string;
    password: string;
    language: 'pl' | 'en';
};

export type LoginResponse = {
    token: string;

};

export type RegisterRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    language: 'pl' | 'en';
};
