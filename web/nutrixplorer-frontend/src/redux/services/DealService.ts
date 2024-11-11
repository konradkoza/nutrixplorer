import { Deal, DealPage } from "@/types/DealTypes";
import { api } from "./api";

const DealService = api.injectEndpoints({
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
                url: `/deal/${id}`,
                method: "GET",
            }),
        }),
        getDealsForClient: builder.query<
            DealPage,
            {
                elements: number;
                page: number;
            }
        >({
            query: ({ elements, page }) => ({
                url: "/deal",
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
} = DealService;
