import { api } from "./api";
import { SimpleProduct, SimpleProductPage } from "@/types/ProductTypes.ts";

const FavouriteProductsService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyFavouriteProducts: builder.query<SimpleProduct[], void>({
            query: () => ({
                url: "/favourites",
                method: "GET",
            }),
            providesTags: ["FavouriteProducts"],
        }),
        getMyFavouriteProductsPage: builder.query<
            SimpleProductPage,
            {
                page: number;
                size: number;
            }
        >({
            query: ({ page, size }) => ({
                url: "/favourites/page",
                method: "GET",
                params: {
                    elements: size,
                    page: page,
                },
            }),
            providesTags: ["FavouriteProducts"],
        }),
        addFavourite: builder.mutation<void, string>({
            query: (id) => ({
                url: `/favourites/product/${id}/add`,
                method: "POST",
            }),
            invalidatesTags: ["FavouriteProducts"],
        }),
        deleteFavorite: builder.mutation<void, string>({
            query: (id) => ({
                url: `/favourites/product/${id}/remove`,
                method: "DELETE",
            }),
            invalidatesTags: ["FavouriteProducts"],
        }),
    }),
});

export const {
    useGetMyFavouriteProductsQuery,
    useAddFavouriteMutation,
    useDeleteFavoriteMutation,
    useGetMyFavouriteProductsPageQuery,
} = FavouriteProductsService;
