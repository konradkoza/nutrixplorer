import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SidebarStore = {
    isOpen: boolean;
};

const initialState: SidebarStore = {
    isOpen: true,
};

export const sideBarSlice = createSlice({
    name: "sideBar",
    initialState: initialState,
    reducers: {
        toggleOpen: (state) => {
            state.isOpen = !state.isOpen;
        },
        setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
    },
});

export const { toggleOpen, setIsOpen } = sideBarSlice.actions;

export default sideBarSlice.reducer;
