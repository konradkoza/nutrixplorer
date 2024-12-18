import { Mineral, Vitamin } from "./NutritionalValueTypes";
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
    description?: string;
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
    description?: string | undefined;
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

export type BasketFiltersFormType = {
    name: string | undefined;
    minCarbs: string | undefined;
    maxCarbs: string | undefined;
    minFat: string | undefined;
    maxFat: string | undefined;
    minProtein: string | undefined;
    maxProtein: string | undefined;
    minFiber: string | undefined;
    maxFiber: string | undefined;
    minEnergy: string | undefined;
    maxEnergy: string | undefined;
    minSalt: string | undefined;
    maxSalt: string | undefined;
    minSugar: string | undefined;
    maxSugar: string | undefined;
    minSaturatedFat: string | undefined;
    maxSaturatedFat: string | undefined;
    vitamins: Vitamin[];
    minerals: Mineral[];
    allergens: string[];
};
