import { ProductIndex } from "@/types/ProductTypes";

export const getProductImage = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/${id}/image`);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
};

export const getEnergyIndex = (value: number) => {
    if (value < 100) {
        return "A";
    }
    if (value >= 100 && value <= 200) {
        return "B";
    }
    if (value >= 201 && value <= 300) {
        return "C";
    }
    if (value >= 301 && value <= 500) {
        return "D";
    }
    if (value >= 501 && value <= 700) {
        return "E";
    }
    if (value > 700) {
        return "F";
    }
    return "A";
};

export const productIndexesNames = [
    { name: "E", displayName: "EN" },
    { name: "V", displayName: "VIT" },
    { name: "M", displayName: "MIN" },
    { name: "O", displayName: "OM3" },
    { name: "P", displayName: "PRT" },
    { name: "F", displayName: "FIB" },
    { name: "S", displayName: "SUM" },
    { name: "T", displayName: "FF" },
];

export type IndexName = "V" | "M" | "O" | "P" | "F" | "S" | "T" | "E";

export const returnIndexValue = (indexName: IndexName, indexes: ProductIndex[]) => {
    const index = indexes.find((index) => index.indexName === indexName);
    if (index) {
        return index.indexValue;
    } else {
        return 0;
    }
};

export const getIndexColor = (indexValue: number, indexName: IndexName) => {
    switch (indexName) {
        //for energy index (EN) from green to yellow to orange to red
        //for vitamin index (VIT) and mineral index (MIN) from red to yellow to green, values from 0 to 5
        //for omega-3 index (OM3) from white to blue to green
        //for protein index (PRT) from white to blue to green
        //for fiber index (FIB) from white to blue to green
        //for summary index (SUM) from white to blue to green , values from 0 to 8+
        //for fat index (FF) from white to blue to green , values from 0 to 10+
        case "E":
            if (indexValue < 100) {
                return "rgb(0, 150, 0)"; // darker green
            }
            if (indexValue >= 100 && indexValue <= 200) {
                return "rgb(163 230 53)";
            }
            if (indexValue >= 201 && indexValue <= 500) {
                return "rgb(204, 204, 0)";
            }
            if (indexValue > 500) {
                return "rgb(150, 0, 0)";
            }
            break;
        case "V":
        case "M":
            // if (indexValue === 0) {
            //     return "rgb(220 38 38)"; // darker red
            // }
            if (indexValue === 0) {
                return "rgb(169, 169, 169)";
            }
            if (indexValue >= 1 && indexValue <= 3) {
                return "rgb(0, 160, 100)";
            }
            if (indexValue >= 4 && indexValue <= 5) {
                return "rgb(0, 160, 50)";
            }
            if (indexValue >= 6) {
                return "rgb(0, 140, 0)";
            }
            break;
        case "O":
        case "P":
        case "F":
            if (indexValue === 0) {
                return "rgb(169, 169, 169)"; // grey
            }
            if (indexValue >= 1 && indexValue <= 2) {
                return "rgb(0, 160, 100)"; // lighter blue
            }
            if (indexValue >= 3 && indexValue <= 4) {
                return "rgb(0, 160, 50)"; // even darker blue
            }
            if (indexValue >= 5) {
                return "rgb(0, 140, 0)"; // darker green
            }
            break;
        case "S":
            if (indexValue === 0) {
                return "rgb(169, 169, 169)"; // grey
            }
            if (indexValue >= 1 && indexValue < 3) {
                return "rgb(135, 206, 235)";
            }
            if (indexValue >= 3 && indexValue < 5) {
                return "rgb(0, 150, 150)";
            }
            if (indexValue >= 5 && indexValue < 7) {
                return "rgb(0, 175, 75)";
            }
            if (indexValue >= 7 && indexValue <= 9) {
                return "rgb(0, 175, 0)";
            }
            if (indexValue > 10) {
                return "rgb(0, 200, 0)";
            }
            break;
        case "T":
            if (indexValue === 0) {
                return "rgb(169, 169, 169)"; // grey
            }
            if (indexValue >= 1 && indexValue < 3) {
                return "rgb(135, 206, 235)";
            }
            if (indexValue >= 3 && indexValue < 5) {
                return "rgb(0, 150, 150)";
            }
            if (indexValue >= 5 && indexValue < 7) {
                return "rgb(0, 175, 75)";
            }
            if (indexValue >= 7 && indexValue < 9) {
                return "rgb(0, 175, 0)";
            }
            if (indexValue > 10) {
                return "rgb(0, 200, 0)";
            }
            break;
    }
    // grey
    return "rgb(169, 169, 169)";
};
