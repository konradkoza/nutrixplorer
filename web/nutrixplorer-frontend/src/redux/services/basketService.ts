import { api } from "./api";
import { Basket, CreateEntry, EntryUpdate } from "@/types/BasketTypes";

const BasketService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyBaskets: builder.query<Basket[], void>({
            query: () => ({
                url: "/basket/user",
                method: "GET",
            }),
        }),
        getBasketDetails: builder.query<Basket, string>({
            query: (id) => ({
                url: `/basket/${id}`,
                method: "GET",
            }),
        }),
        createBasket: builder.mutation<Basket, Basket>({
            query: (basket) => ({
                url: "/basket",
                method: "POST",
                body: basket,
            }),
        }),
        deleteBasket: builder.mutation<void, string>({
            query: (id) => ({
                url: `/basket/${id}`,
                method: "DELETE",
            }),
        }),
        deleteBasketEntry: builder.mutation<void, string>({
            query: (id) => ({
                url: `/basket/entry/${id}`,
                method: "DELETE",
            }),
        }),
        addBasketEntry: builder.mutation<
            Basket,
            { basketId: string; entry: CreateEntry }
        >({
            query: ({ basketId, entry }) => ({
                url: `/basket/${basketId}/entry`,
                method: "POST",
                body: entry,
            }),
        }),
        updateBasketEntry: builder.mutation<void, EntryUpdate>({
            query: ({ entryId, quantity }) => ({
                url: `/basket/entry/${entryId}`,
                method: "PATCH",
                body: { quantity },
            }),
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
} = BasketService;
