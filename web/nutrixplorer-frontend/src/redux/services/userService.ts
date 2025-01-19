import { UserDetails, UserFilters, UsersPage } from "@/types/UserTypes";
import { api } from "./api";
import { EtagType } from "@/types/Etag";

const UserService = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<
            UsersPage,
            {
                elements: number;
                page: number;
            } & UserFilters
        >({
            query: (filters) => ({
                url: "/users",
                method: "GET",
                params: filters,
            }),
            providesTags: ["Users"],
        }),
        getUser: builder.query<EtagType<UserDetails>, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET",
            }),
            providesTags: ["Users"],
            transformResponse: (baseQueryReturnValue: UserDetails, meta) => {
                const etag = meta!.response!.headers.get("etag");
                return {
                    ...baseQueryReturnValue,
                    etag: etag?.substring(1, etag.length - 1) || "",
                };
            },
        }),
        changeUserEmail: builder.mutation<void, { id: string; email: string }>({
            query: ({ id, email }) => ({
                url: `/users/${id}/email`,
                method: "PATCH",
                body: { newEmail: email },
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id }],
        }),
        changeUserName: builder.mutation<
            void,
            EtagType<{ id: string; firstName: string; lastName: string }>
        >({
            query: ({ id, firstName, lastName, etag }) => ({
                url: `/users/${id}/name`,
                method: "PATCH",
                body: { firstName, lastName },
                headers: {
                    "If-Match": etag,
                },
            }),
            invalidatesTags: ["Users"],
        }),
        assignAdminAccessLevel: builder.mutation<void, string>({
            query: (id) => ({
                url: `/administrator/${id}/access-level`,
                method: "PATCH",
            }),
            invalidatesTags: ["Users"],
        }),
        removeAdminAccessLevel: builder.mutation<void, string>({
            query: (id) => ({
                url: `/administrator/${id}/access-level`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
        assignClientAccessLevel: builder.mutation<void, string>({
            query: (id) => ({
                url: `/client/${id}/access-level`,
                method: "PATCH",
            }),
            invalidatesTags: ["Users"],
        }),
        removeClientAccessLevel: builder.mutation<void, string>({
            query: (id) => ({
                url: `/client/${id}/access-level`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
        blockUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/users/${id}/block`,
                method: "PATCH",
            }),
            invalidatesTags: ["Users"],
        }),
        unblockUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/users/${id}/block`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useAssignAdminAccessLevelMutation,
    useAssignClientAccessLevelMutation,
    useChangeUserEmailMutation,
    useChangeUserNameMutation,
    useRemoveAdminAccessLevelMutation,
    useRemoveClientAccessLevelMutation,
    useBlockUserMutation,
    useUnblockUserMutation,
} = UserService;
