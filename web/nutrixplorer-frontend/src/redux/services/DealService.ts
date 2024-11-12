import { Deal, DealPage } from "@/types/DealTypes";
import { api } from "./api";

const dealService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllDeals: builder.query<
            DealPage,
            {
                elements: number;
                page: number;
            }
        >({
            query: ({ elements, page }) => ({
                url: "/deal/all",
                method: "GET",
                params: {
                    elements: elements,
                    page: page,
                },
            }),
        }),
        getMyDeals: builder.query<
            DealPage,
            {
                elements: number;
                page: number;
            }
        >({
            query: ({ elements, page }) => ({
                url: "/deal/seller",
                method: "GET",
                params: {
                    elements: elements,
                    page: page,
                },
            }),
        }),
        getDealDetails: builder.query<Deal, string>({
            query: (id) => ({
                url: `/deal/current/${id}`,
                method: "GET",
            }),
        }),
        getCurrentDeals: builder.query<
            DealPage,
            {
                elements: number;
                page: number;
            }
        >({
            query: ({ elements, page }) => ({
                url: "/deal/current",
                method: "GET",
                params: {
                    elements: elements,
                    page: page,
                },
            }),
        }),
    }),
});

export const {
    useGetAllDealsQuery,
    useGetMyDealsQuery,
    useGetDealDetailsQuery,
    useGetCurrentDealsQuery,
} = dealService;
