// src/store/storeSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface StoreItem {
  id: number;
  name: string;
  address: string;
  can_purchase: boolean;
}

interface AddStorePayload {
  name: string;
  address: string;
}

interface UpdateStorePayload extends AddStorePayload {
  id: number;
}

interface StoreState {
  stores: StoreItem[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    // ===== Fetch =====
    fetchStoresStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStoresSuccess(state, action: PayloadAction<StoreItem[]>) {
      state.stores = action.payload;
      state.loading = false;
    },
    fetchStoresFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Create =====
    addStoreStart(state, _action: PayloadAction<AddStorePayload>) {
      state.loading = true;
      state.error = null;
    },
    addStoreSuccess(state) {
      state.loading = false;
    },
    addStoreFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Update =====
    updateStoreStart(state, _action: PayloadAction<UpdateStorePayload>) {
      state.loading = true;
    },
    updateStoreSuccess(state) {
      state.loading = false;
    },
    updateStoreFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Delete =====
    deleteStoreStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    deleteStoreSuccess(state) {
      state.loading = false;
    },
    deleteStoreFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStoresStart,
  fetchStoresSuccess,
  fetchStoresFailure,

  addStoreStart,
  addStoreSuccess,
  addStoreFailure,

  updateStoreStart,
  updateStoreSuccess,
  updateStoreFailure,

  deleteStoreStart,
  deleteStoreSuccess,
  deleteStoreFailure,
} = storeSlice.actions;

export default storeSlice.reducer;
