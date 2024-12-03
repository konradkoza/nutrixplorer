import { BasketEntry } from "@/types/BasketTypes";

export const calculateMax = (entries: BasketEntry[][]): number => {
    // max sum of fat carbs salt protein fibre of all entries
    let max = 0;
    entries.forEach((basket) => {
        basket.forEach((entry) => {
            const sum = entry.product.nutritionalValues.reduce((acc, value) => {
                if (
                    value.nutritionalValueName.name === "Total" ||
                    value.nutritionalValueName.name === "Białko" ||
                    value.nutritionalValueName.name === "Błonnik" ||
                    value.nutritionalValueName.name === "Sól"
                ) {
                    acc += value.quantity * (entry.units / 100);
                }
                return acc;
            }, 0);
            if (sum > max) {
                max = sum;
            }
        });
    });
    return Math.ceil(max);
};
