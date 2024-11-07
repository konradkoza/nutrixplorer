import { Deal, SimpleDeal } from "@/types/DealTypes";
import { api } from "./api";

const DealService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllDeals: builder.query<SimpleDeal[], void>({
            query: () => ({
                url: "/deal",
                method: "GET",
            }),
        }),
        getMyDeals: builder.query<SimpleDeal[], void>({
            query: () => ({
                url: "/deal/my",
                method: "GET",
            }),
        }),
        getDealDetails: builder.query<Deal, string>({
            query: (id) => ({
                url: `/deal/${id}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllDealsQuery, useGetMyDealsQuery } = DealService;
