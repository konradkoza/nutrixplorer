import { Mineral, SimpleNutritionElements, Vitamin } from "@/types/NutritionalValueTypes";

export const simpleNutritionTable: SimpleNutritionElements[] = [
    {
        name: "Wartość Energetyczna",
        group: "Wartość Energetyczna",
        variantConsists: null,
        variantNotConsists: null,
    },
    {
        name: "Total",
        group: "Tłuszcz",
        displayName: "Tłuszcz",
        variantConsists: "yellow",
        variantNotConsists: "green",
    },
    {
        name: "Kwasy nasycone",
        group: "Tłuszcz",
        displayName: "w tym kwasy tłuszczowe nasycone",
        variantConsists: "red",
        variantNotConsists: "green",
    },
    {
        name: "Total",
        group: "Węglowodany",
        displayName: "Węglowodany",
        variantConsists: "yellow",
    },
    {
        name: "Cukry",
        group: "Węglowodany",
        displayName: "w tym cukry",
        variantConsists: "red",
        variantNotConsists: "green",
    },
    { name: "Błonnik", group: "Błonnik", variantConsists: "green", variantNotConsists: "red" },
    { name: "Białko", group: "Białko", variantConsists: "green", variantNotConsists: "red" },
    { name: "Sól", group: "Sól", variantConsists: "red", variantNotConsists: "green" },
];

export const vitaminsNames: Vitamin[] = [
    "B7",
    "K",
    "B2",
    "B6",
    "C",
    "B1",
    "B5",
    "D",
    "B9",
    "E",
    "A",
    "B12",
    "B3",
];

export const mineralsNames: Mineral[] = [
    "Magnez",
    "Fluorek",
    "Mangan",
    "Wapń",
    "Miedź",
    "Żelazo",
    "Selen",
    "Molibden",
    "Fosfor",
    "Jod",
    "Chrom",
    "Potas",
    "Cynk",
];
