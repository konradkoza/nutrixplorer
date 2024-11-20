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
            providesTags: ["Deals"],
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
            providesTags: ["Deals"],
        }),
        getDealDetails: builder.query<Deal, string>({
            query: (id) => ({
                url: `/deal/current/${id}`,
                method: "GET",
            }),
            providesTags: (_, __, arg) => [{ type: "Deals", id: arg }],
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
            providesTags: ["Deals"],
        }),
    }),
});

export const {
    useGetAllDealsQuery,
    useGetMyDealsQuery,
    useGetDealDetailsQuery,
    useGetCurrentDealsQuery,
} = dealService;
