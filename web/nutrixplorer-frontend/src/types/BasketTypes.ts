import { ProductIndex, SimpleProduct } from "./ProductTypes";

export type BasketEntry = {
    id: string;
    product: SimpleProduct;
    units: number;
    productIndexes: ProductIndex[];
};

export type Basket = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    basketEntries: BasketEntry[];
};

export type SimpleBasket = {
    id: string;
    name: string;
};

export type CreateEntry = {
    productId: string;
    quantity: number;
};

export type CreateBasket = {
    name: string;
    description: string;
};

export type EntryUpdate = {
    entryId: string;
    quantity: number;
};

export type BasketNutritions = {
    name: string;
    groupName: string;
    quantity: number;
    unit: string;
};
