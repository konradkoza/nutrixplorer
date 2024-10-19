import { UserPersonalData } from "@/types/UserTypes";
import { api } from "./api";

const MeService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<UserPersonalData, void>({
            query: () => ({
                url: "/me",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetMeQuery } = MeService;
