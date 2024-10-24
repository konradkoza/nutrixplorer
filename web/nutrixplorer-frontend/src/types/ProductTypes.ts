export type SimpleProduct = {
    id: string;
    productName: string;
    productDescription: string;
    productQuantity: string;
    unit: {
        name: string;
    };
};

export type SimpleProductPage = {
    products: SimpleProduct[];
    numberOfPages: number;
};

export type ProductDetails = {
    id: string;
    productName: string;
    productDescription: string;
    productQuantity: string;
    unit: {
        name: string;
    };
};
