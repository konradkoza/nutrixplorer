import { SimpleProductPage } from "@/types/ProductTypes";
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
    }),
});

export const { useGetProductPageQuery } = ProductService;
