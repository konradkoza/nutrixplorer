import { EtagType } from "@/types/Etag";
import { api } from "./api";
import {
    Basket,
    BasketFiltersFormType,
    BasketNutritions,
    BasketsPage,
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
        getBasketDetails: builder.query<EtagType<Basket>, string>({
            query: (id) => ({
                url: `/basket/${id}`,
                method: "GET",
            }),
            providesTags: ["Baskets"],
            transformResponse: (baseQueryReturnValue: Basket, meta) => {
                const etag = meta!.response!.headers.get("etag");
                return {
                    ...baseQueryReturnValue,
                    etag: etag?.substring(1, etag.length - 1) || "",
                };
            },
        }),
        createBasket: builder.mutation<SimpleBasket, CreateBasket>({
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
        updateBasket: builder.mutation<
            Basket,
            EtagType<{ basketId: string; basket: CreateBasket }>
        >({
            query: ({ basketId, basket, etag }) => ({
                url: `/basket/${basketId}`,
                method: "PATCH",
                body: basket,
                headers: {
                    "If-Match": etag,
                },
            }),
            invalidatesTags: ["Baskets"],
        }),
        copyBasket: builder.mutation<Basket, { basketId: string; basket: CreateBasket }>({
            query: (data) => ({
                url: `/basket/${data.basketId}/copy`,
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
        getFilteredBaskets: builder.query<
            BasketsPage,
            {
                elements: number;
                page: number;
            } & BasketFiltersFormType
        >({
            query: (data) => ({
                url: `/basket/filtered`,
                method: "GET",
                params: {
                    ...data,
                },
            }),
            providesTags: ["Baskets"],
        }),
        getFilteredBasketsList: builder.query<SimpleBasket[], string>({
            query: (name) => ({
                url: `/basket/user/filtered`,
                method: "GET",
                params: {
                    name,
                },
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
    useCopyBasketMutation,
    useUpdateBasketMutation,
    useGetBasketNutritionsQuery,
    useLazyGetFilteredBasketsQuery,
    useGetBasketAllergensQuery,
    useLazyGetBasketAllergensQuery,
    useLazyGetBasketNutritionsQuery,
    useLazyGetBasketDetailsQuery,
    useGetFilteredBasketsQuery,
    useGetFilteredBasketsListQuery,
} = BasketService;
