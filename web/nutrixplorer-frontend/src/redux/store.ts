import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import { authSlice } from "./slices/authSlice";
import { sideBarSlice } from "./slices/sideBarSlice";
import { rtkQueryErrorHandler } from "./middleware/errorHandlingMiddleware";
import { comparisonSlice } from "./slices/comparisonSlice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        authSlice: authSlice.reducer,
        sideBarSlice: sideBarSlice.reducer,
        comparisonSlice: comparisonSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware).concat(rtkQueryErrorHandler),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
