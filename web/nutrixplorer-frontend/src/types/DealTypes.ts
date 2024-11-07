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
    sellerId: string;
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
};
