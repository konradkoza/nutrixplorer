export type SimpleProduct = {
    id: string;
    productName: string;
    productDescription: string;
    productQuantity: number;
    unit: string;
};

export type SimpleProductPage = {
    products: SimpleProduct[];
    numberOfPages: number;
};

export type ProductDetails = {
    id: string;
    productName: string;
    productDescription: string;
    productQuantity: number;
    ean: string;
    unit: string;
    country: string;
    packageType: string;
    productIndexes: ProductIndex[];
    nutritionalIndexes: NutritionalIndex[];
    ratings: ProductRating[];
    composition: ProductComposition;
    producer: Producer;
    label: ProductLabel;
    nutritionalValues: NutritionalValue[];
    portion: Portion;
};

export type Producer = {
    name: string;
    address: string;
    countryCode: string;
    contact: string;
    nip: string;
};

export type ProductComposition = {
    id: string;
    ingredients: string[];
    additions: string[];
    flavour: string | null;
};

export type ProductRating = {
    groupName: string;
    name: string;
};

export type ProductLabel = {
    storage: string;
    durability: string;
    instructionsAfterOpening: string;
    preparation: string;
    allergens: string;
};

export type ProductIndex = {
    indexName: string;
    indexValue: number;
};

export type NutritionalIndex = {
    indexValue: number;
    legend: string;
};

export type NutritionalValue = {
    nutritionalValueName: NutritionalValueName;
    quantity: number;
    unit: string;
    nrv: number;
};

export type Portion = {
    portionQuantity: number;
    unit: string;
};

export type NutritionalValueName = {
    name: string;
    group: string;
};
