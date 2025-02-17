import { FilteringFormType } from "@/pages/Products/FilteringComponent.tsx";
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
        getProductFilteredPage: builder.query<
            SimpleProductPage,
            {
                elements: number;
                page: number;
            } & FilteringFormType
        >({
            query: (data) => ({
                url: "/product",
                method: "GET",
                params: {
                    ...data,
                },
            }),
            providesTags: ["Products"],
        }),
        getProductByName: builder.query<string[], string>({
            query: (data) => ({
                url: "/product/name",
                method: "GET",
                params: {
                    productName: data,
                    elements: 5,
                },
            }),
            providesTags: ["Products"],
        }),
        getProductDetails: builder.query<ProductDetails, string>({
            query: (id) => ({
                url: `/product/${id}`,
                method: "GET",
            }),
            providesTags: (_, __, arg) => [{ type: "Products", id: arg }],
        }),
        getProductProducer: builder.query<Producer, string>({
            query: (id) => ({
                url: `/product/${id}/producer`,
                method: "GET",
            }),
            providesTags: (_, __, arg) => [{ type: "Products", id: arg }],
        }),
        getProductComposition: builder.query<ProductComposition[], string>({
            query: (id) => ({
                url: `/product/${id}/composition`,
                method: "GET",
            }),
            providesTags: (_, __, arg) => [{ type: "Products", id: arg }],
        }),
        getProductRating: builder.query<ProductRating[], string>({
            query: (id) => ({
                url: `/product/${id}/rating`,
                method: "GET",
            }),
            providesTags: (_, __, arg) => [{ type: "Products", id: arg }],
        }),
        getPackageTypes: builder.query<string[], void>({
            query: () => ({
                url: "/product/package-types",
                method: "GET",
            }),
        }),
        getAllergens: builder.query<string[], void>({
            query: () => ({
                url: "/product/allergens",
                method: "GET",
            }),
        }),
        getAllCountries: builder.query<string[], void>({
            query: () => ({
                url: "/product/countries",
                method: "GET",
            }),
            transformResponse(baseQueryReturnValue: string[]) {
                const countries = new Set<string>();
                baseQueryReturnValue.forEach((country) => {
                    if (country === null) return;
                    country.split(",").forEach((c) => {
                        countries.add(c.trim());
                    });
                });
                return Array.from(countries);
            },
        }),
    }),
});

export const {
    useGetProductFilteredPageQuery,
    useGetProductCompositionQuery,
    useGetProductDetailsQuery,
    useGetProductProducerQuery,
    useGetProductRatingQuery,
    useGetPackageTypesQuery,
    useGetAllergensQuery,
    useGetAllCountriesQuery,
    useGetProductByNameQuery,
} = ProductService;
