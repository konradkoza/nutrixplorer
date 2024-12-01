import { NutritionalValue, ProductIndex } from "./ProductTypes";

export type BasketEntry = {
    id: string;
    units: number;
    productIndexes: ProductIndex[];
    product: BasketEntryProduct;
};

export type Basket = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    basketEntries: BasketEntry[];
};

export type BasketEntryProduct = {
    id: string;
    productName: string;
    productDescription: string;
    productQuantity: number;
    unit: string;
    nutritionalValues: NutritionalValue[];
    allergenList: string[];
};

export type BasketWithNutritions = {
    basket: Basket;
    nutritions: BasketNutritions[];
};

export type BasketsPage = {
    baskets: Basket[];
    numberOfPages: number;
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
