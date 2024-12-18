export type SimpleNutritionalValue = {
    name: string;
    group: string;
    unit: string;
};

export type Vitamin =
    | "B7"
    | "K"
    | "B2"
    | "B6"
    | "C"
    | "B1"
    | "B5"
    | "D"
    | "B9"
    | "E"
    | "A"
    | "B12"
    | "B3";
export type Mineral =
    | "Magnez"
    | "Fluorek"
    | "Mangan"
    | "Wapń"
    | "Miedź"
    | "Żelazo"
    | "Selen"
    | "Molibden"
    | "Fosfor"
    | "Jod"
    | "Chrom"
    | "Potas"
    | "Cynk";

export type SimpleNutritionElements = {
    name: string;
    group: string;
    displayName?: string;
    showIfZero?: boolean;
    variantConsists?: "red" | "yellow" | "green" | null;
    variantNotConsists?: "red" | "yellow" | "green" | null;
};
