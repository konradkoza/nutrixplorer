import { LoginRequest, LoginResponse } from "@/types/AuthenticationTypes";
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
    }),
});

export const { useLoginMutation } = AuthService;
