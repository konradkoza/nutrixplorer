import { SimpleProduct } from "./ProductTypes";

export type Deal = {
    id: string;
    name: string;
    description: string;
    oldPrice: number;
    newPrice: number;
    startDate: string;
    endDate: string;
    product: SimpleProduct;
    active: boolean;
    seller: {
        address: {
            city: string;
            street: string;
            country: string;
            shopName: string;
            zip: string;
            number: string;
        };
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    };
};

export type SimpleDeal = {
    id: string;
    name: string;
    description: string;
    oldPrice: number;
    newPrice: number;
    startDate: string;
    endDate: string;
    product: SimpleProduct;
    seller: {
        shopName: string;
        city: string;
    };
};

export type DealPage = {
    deals: SimpleDeal[];
    numberOfPages: number;
};
