import { SimpleProduct } from "./ProductTypes";

export type BasketEntry = {
    id: string;
    product: SimpleProduct;
    units: number;
};

export type Basket = {
    id: string;
    name: string;
    description: string;
    basketEntries: BasketEntry[];
};

export type CreateEntry = {
    productId: string;
    quantity: number;
};

export type CreateBasket = {
    name: string;
    description: string;
    basketEntries: CreateEntry[];
};

export type EntryUpdate = {
    entryId: string;
    quantity: number;
};
