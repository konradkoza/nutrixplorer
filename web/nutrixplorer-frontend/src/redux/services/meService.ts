import { UserPersonalData } from "@/types/UserTypes";
import { api } from "./api";

const MeService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<UserPersonalData, void>({
            query: () => ({
                url: "/me",
                method: "GET",
            }),
            providesTags: ["UserData"],
        }),
        changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
            query: (credentials) => ({
                url: "/me/change-password",
                method: "PATCH",
                body: credentials,
            }),
            invalidatesTags: ["UserData"],
        }),
        changeEmail: builder.mutation<void, string>({
            query: (newEmail) => ({
                url: "/me/change-email-init",
                method: "PATCH",
                body: { newEmail: newEmail },
            }),
            invalidatesTags: ["UserData"],
        }),
        changeEmailFinish: builder.mutation<void, string>({
            query: (token) => ({
                url: "/me/change-email",
                method: "PATCH",
                body: { token },
            }),
            invalidatesTags: ["UserData"],
        }),
        changeName: builder.mutation<void, { firstName: string; lastName: string }>({
            query: (data) => ({
                url: "/me/name",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["UserData"],
        }),
        changeLanguage: builder.mutation<void, string>({
            query: (language) => ({
                url: "/me/language",
                method: "PATCH",
                body: { language },
            }),
            invalidatesTags: ["UserData"],
        }),
    }),
});

export const {
    useGetMeQuery,
    useLazyGetMeQuery,
    useChangeEmailMutation,
    useChangePasswordMutation,
    useChangeEmailFinishMutation,
    useChangeNameMutation,
    useChangeLanguageMutation,
} = MeService;
