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

const colors = {
    lightBlue: "rgb(0, 170, 235)",
    blue: "rgb(0, 130, 150)",
    darkGreen: "rgb(0, 100, 50)",
    green: "rgb(0, 160, 50)",
    lightGreen: "rgb(0, 230, 50)",
    yellow: "rgb(250, 248, 0)",
    orange: "rgb(255, 165, 0)",
    red: "rgb(220, 38, 38)",
    grey: "rgb(169, 169, 169)",
};

export const getIndexColor = (indexValue: number, indexName: IndexName) => {
    switch (indexName) {
        case "E":
            if (indexValue < 100) {
                return colors.blue;
            }
            if (indexValue >= 100 && indexValue <= 200) {
                return colors.lightBlue;
            }
            if (indexValue >= 201 && indexValue <= 300) {
                return colors.green;
            }
            if (indexValue >= 301 && indexValue <= 500) {
                return colors.yellow;
            }
            if (indexValue >= 501 && indexValue <= 700) {
                return colors.orange;
            }
            if (indexValue > 700) {
                return colors.red;
            }
            break;
        case "V":
        case "M":
            // if (indexValue === 0) {
            //     return "rgb(220 38 38)"; // darker red
            // }
            if (indexValue === 0) {
                return colors.grey;
            }
            if (indexValue >= 1 && indexValue <= 3) {
                return colors.lightGreen;
            }
            if (indexValue >= 4 && indexValue <= 5) {
                return colors.green;
            }
            if (indexValue >= 6) {
                return colors.blue;
            }
            break;
        case "O":
        case "P":
        case "F":
            if (indexValue === 0) {
                return colors.grey;
            }
            if (indexValue >= 1 && indexValue <= 2) {
                return colors.lightGreen;
            }
            if (indexValue >= 3 && indexValue <= 4) {
                return colors.green;
            }
            if (indexValue >= 5) {
                return colors.blue;
            }
            break;
        case "S":
            if (indexValue === 0) {
                return colors.grey;
            }
            if (indexValue >= 1 && indexValue < 3) {
                return colors.lightGreen;
            }
            if (indexValue >= 3 && indexValue < 5) {
                return colors.green;
            }
            if (indexValue >= 5 && indexValue < 7) {
                return colors.darkGreen;
            }
            if (indexValue >= 7 && indexValue <= 9) {
                return colors.lightBlue;
            }
            if (indexValue > 10) {
                return colors.blue;
            }
            break;
        case "T":
            if (indexValue === 0) {
                return colors.grey;
            }
            if (indexValue >= 1 && indexValue < 3) {
                return colors.lightGreen;
            }
            if (indexValue >= 3 && indexValue < 5) {
                return colors.green;
            }
            if (indexValue >= 5 && indexValue < 7) {
                return colors.darkGreen;
            }
            if (indexValue >= 7 && indexValue <= 9) {
                return colors.lightBlue;
            }
            if (indexValue > 10) {
                return colors.blue;
            }
            break;
    }
    // grey
    return "rgb(169, 169, 169)";
};
