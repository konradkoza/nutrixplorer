import { api } from "./api";
import {
    Basket,
    BasketNutritions,
    CreateBasket,
    CreateEntry,
    EntryUpdate,
    SimpleBasket,
} from "@/types/BasketTypes";

const BasketService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyBaskets: builder.query<Basket[], void>({
            query: () => ({
                url: "/basket/user",
                method: "GET",
            }),
            providesTags: ["Baskets"],
        }),
        getBasketDetails: builder.query<Basket, string>({
            query: (id) => ({
                url: `/basket/${id}`,
                method: "GET",
            }),
            providesTags: ["Baskets"],
        }),
        createBasket: builder.mutation<Basket, CreateBasket>({
            query: (basket) => ({
                url: "/basket",
                method: "POST",
                body: basket,
            }),
            invalidatesTags: ["Baskets"],
        }),
        deleteBasket: builder.mutation<void, string>({
            query: (id) => ({
                url: `/basket/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Baskets"],
        }),
        deleteBasketEntry: builder.mutation<void, string>({
            query: (id) => ({
                url: `/basket/entry/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Baskets"],
        }),
        addBasketEntry: builder.mutation<Basket, { basketId: string; entry: CreateEntry }>({
            query: ({ basketId, entry }) => ({
                url: `/basket/${basketId}/entry`,
                method: "POST",
                body: entry,
            }),
            invalidatesTags: ["Baskets"],
        }),

        updateBasketEntry: builder.mutation<void, EntryUpdate>({
            query: ({ entryId, quantity }) => ({
                url: `/basket/entry/${entryId}`,
                method: "PATCH",
                body: { quantity },
            }),
            invalidatesTags: ["Baskets"],
        }),
        updateBasket: builder.mutation<Basket, { basketId: string; basket: CreateBasket }>({
            query: ({ basketId, basket }) => ({
                url: `/basket/${basketId}`,
                method: "PATCH",
                body: basket,
            }),
            invalidatesTags: ["Baskets"],
        }),
        cloneBasket: builder.mutation<Basket, { basketId: string; basket: CreateBasket }>({
            query: (data) => ({
                url: `/basket/${data.basketId}/clone`,
                method: "POST",
                body: data.basket,
            }),
            invalidatesTags: ["Baskets"],
        }),
        getBasketNutritions: builder.query<BasketNutritions[], string>({
            query: (id) => ({
                url: `/basket/${id}/nutritional-values`,
                method: "GET",
            }),
            providesTags: ["Baskets"],
        }),
        getBasketAllergens: builder.query<string[], string>({
            query: (id) => ({
                url: `/basket/${id}/allergens`,
                method: "GET",
            }),
            providesTags: ["Baskets"],
        }),
        getUserBasketsList: builder.query<SimpleBasket[], void>({
            query: () => ({
                url: `/basket/user/list`,
                method: "GET",
            }),
            providesTags: ["Baskets"],
        }),
    }),
});

export const {
    useGetMyBasketsQuery,
    useGetBasketDetailsQuery,
    useCreateBasketMutation,
    useDeleteBasketEntryMutation,
    useDeleteBasketMutation,
    useAddBasketEntryMutation,
    useUpdateBasketEntryMutation,
    useCloneBasketMutation,
    useUpdateBasketMutation,
    useGetBasketNutritionsQuery,
    useGetBasketAllergensQuery,
    useGetUserBasketsListQuery,
    useLazyGetBasketAllergensQuery,
    useLazyGetBasketNutritionsQuery,
    useLazyGetBasketDetailsQuery,
} = BasketService;
