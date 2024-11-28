import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/AuthenticationTypes";
import { UserPersonalData } from "@/types/UserTypes";
import { api } from "./api";

const AuthService = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation<UserPersonalData, RegisterRequest>({
            query: (credentials) => ({
                url: "auth/register-client",
                method: "POST",
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = AuthService;
