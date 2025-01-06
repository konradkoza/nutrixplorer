import { UserDetails, UserPersonalData } from "@/types/UserTypes";
import { api } from "./api";
import { EtagType } from "@/types/Etag";

const MeService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<UserPersonalData, void>({
            query: () => ({
                url: "/me",
                method: "GET",
            }),
            providesTags: ["UserData"],
        }),
        getMeDetails: builder.query<EtagType<UserDetails>, void>({
            query: () => ({
                url: "/me/details",
                method: "GET",
            }),
            providesTags: ["UserData"],
            transformResponse: (baseQueryReturnValue: UserDetails, meta) => {
                const etag = meta!.response!.headers.get("etag");
                return {
                    ...baseQueryReturnValue,
                    etag: etag?.substring(1, etag.length - 1) || "",
                };
            },
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
        changeName: builder.mutation<void, EtagType<{ firstName: string; lastName: string }>>({
            query: (data) => ({
                url: "/me/name",
                method: "PATCH",
                body: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                },
                headers: {
                    "If-Match": data.etag,
                },
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
    useGetMeDetailsQuery,
    useLazyGetMeQuery,
    useChangeEmailMutation,
    useChangePasswordMutation,
    useChangeEmailFinishMutation,
    useChangeNameMutation,
    useChangeLanguageMutation,
} = MeService;
