import {
    Producer,
    ProductComposition,
    ProductDetails,
    ProductRating,
    SimpleProductPage,
} from "@/types/ProductTypes";
import { api } from "./api";

const ProductService = api.injectEndpoints({
    endpoints: (builder) => ({
        getProductPage: builder.query<
            SimpleProductPage,
            {
                elements: number;
                page: number;
            }
        >({
            query: ({ elements, page }) => ({
                url: "/product",
                method: "GET",
                params: {
                    elements: elements,
                    page: page,
                },
            }),
        }),
        getProductDetails: builder.query<ProductDetails, string>({
            query: (id) => ({
                url: `/product/${id}`,
                method: "GET",
            }),
        }),
        getProductProducer: builder.query<Producer, string>({
            query: (id) => ({
                url: `/product/${id}/producer`,
                method: "GET",
            }),
        }),
        getProductComposition: builder.query<ProductComposition[], string>({
            query: (id) => ({
                url: `/product/${id}/composition`,
                method: "GET",
            }),
        }),
        getProductRating: builder.query<ProductRating[], string>({
            query: (id) => ({
                url: `/product/${id}/rating`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetProductPageQuery,
    useGetProductCompositionQuery,
    useGetProductDetailsQuery,
    useGetProductProducerQuery,
    useGetProductRatingQuery,
} = ProductService;
