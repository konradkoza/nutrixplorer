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
        loginOauth: builder.mutation<LoginResponse, string>({
            query: (code) => ({
                url: "auth/oauth2/token",
                method: "POST",
                body: { code },
            }),
        }),
        activateAccount: builder.mutation<void, string>({
            query: (token) => ({
                url: "auth/activate",
                method: "POST",
                body: { token },
            }),
        }),
        forgotPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: "auth/reset-password",
                method: "POST",
                body: { email },
            }),
        }),
        changePasswordWithToken: builder.mutation<void, { token: string; newPassword: string }>({
            query: (data) => ({
                url: "auth/change-password",
                method: "PATCH",
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLoginOauthMutation,
    useActivateAccountMutation,
    useForgotPasswordMutation,
    useChangePasswordWithTokenMutation,
} = AuthService;
