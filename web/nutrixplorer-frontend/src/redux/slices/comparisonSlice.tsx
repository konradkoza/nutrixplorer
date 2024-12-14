import { SimpleBasket } from "@/types/BasketTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ComparisonState = {
    baskets: SimpleBasket[];
};

const initialState: ComparisonState = {
    baskets: [],
};

export const comparisonSlice = createSlice({
    name: "comparisonSlice",
    initialState: initialState,
    reducers: {
        add: (state, action: PayloadAction<SimpleBasket>) => {
            if (state.baskets.length >= 2) {
                state.baskets = [action.payload];
                return;
            }
            state.baskets = [...state.baskets, action.payload];
        },
        remove: (state, action: PayloadAction<SimpleBasket>) => {
            state.baskets = state.baskets.filter((basket) => basket.id !== action.payload.id);
        },
        clear: (state) => {
            state.baskets = [];
        },
    },
});

export const { add, clear, remove } = comparisonSlice.actions;

export default comparisonSlice.reducer;
