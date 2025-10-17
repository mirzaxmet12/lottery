import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
    id: string,
    phone_number: string,
    full_name: null | string,
    role: string,
    store: {
        id?: number | null,
        name: string,
        address: string
    }
}

interface AuthState {
    registering: boolean;
    registerError: string | null;
    userId: number | null;
    user: UserInfo|null;

    verifying: boolean;
    verifyError: string | null;

    logging: boolean;
    loginError: string | null;

    accessToken: string | null;
    refreshToken: string | null;
};

const initialState: AuthState = {
    registering: false,
    registerError: null,
    userId: null,
    user: null,

    verifying: false,
    verifyError: null,

    logging: false,
    loginError: null,

    accessToken: localStorage.getItem('access'),
    refreshToken: localStorage.getItem('refresh'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // - Login -
        loginStart(state, _action: PayloadAction<{ phone_number: string; password: string }>) {
            state.logging = true;
            state.loginError = null;
        },
        loginSuccess(state, action: PayloadAction<{ access: string; refresh: string }>) {
            state.logging = false;

            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.logging = false;
            state.loginError = action.payload;
        },

        // User info
        getMeStart(state) {
            state.logging = true;
            state.loginError = null;
        },
        getMeSuccess(state, action: PayloadAction<UserInfo>) {
            state.logging = false;
            state.user = action.payload;
            console.log(action.payload);
            console.log(state.user);


        },
        getMeFailure(state, action: PayloadAction<string>) {
            state.logging = false;
            state.loginError = action.payload;
        },

        // - Logout -
        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.logging = false;
            state.loginError = null;
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, getMeStart, getMeSuccess, getMeFailure } = authSlice.actions;

export default authSlice.reducer;