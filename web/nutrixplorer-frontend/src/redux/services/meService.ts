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
    }),
});

export const { useGetMeQuery, useLazyGetMeQuery } = MeService;
