import { AuthState } from "@/types/SlicesStatesTypes";
import { AccessLevel } from "@/types/UserTypes";
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";

const initialState: AuthState = {
    user: "",
    accessLevels: [],
    token: "",
};

type Payload = {
    authorities: AccessLevel[];
} & JwtPayload;

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            const payload = jwtDecode<Payload>(action.payload.token);
            state.user = payload.sub || "";
            state.accessLevels = payload.authorities;
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = "";
            state.accessLevels = [];
            state.token = "";
            localStorage.removeItem("token");
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
