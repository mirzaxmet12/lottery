import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// --- Interfaces ---
export interface GlobalSummary {
  purchases_count: number;
  total_spent: number;
}

export interface Client {
  id: number;
  full_name: string;
  phone_number: string;
  global_summary?: GlobalSummary;
  stores?: [
    {
      id: number,
      name: string,
      current_bonuses: number,
      purchases_count: number,
      total_spent: number
    }
  ]
}

export interface AddClientAndPurchasePayload {
  full_name: string;
  phone_number: string;
  amount: number;
  store: number;
}

export interface ClearBonusesPayload {
  store_id: number;
}

interface ClientState {
  next: string | null,
  previous: string | null,
  count: number,
  clients: Client[];
  loading: boolean;
  error: string | null;
}

// --- Initial state ---
const initialState: ClientState = {
  next: null,
  previous: null,
  count: 0,
  clients: [],
  loading: false,
  error: null,
};

// --- Slice ---
const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    // --- Fetch clients ---
    fetchClientsStart(state, _action: PayloadAction<string>) {
      state.loading = true;
    },
    fetchClientsSuccess(state, action: PayloadAction<any>) {
      state.clients = action.payload.results;
      state.count = action.payload.count;
      state.loading = false;
    },
    fetchClientsFailure(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload || "Error fetching clients";
      state.loading = false;
    },

    // --- Add client + purchase ---
    addClientAndPurchaseStart(
      state,
      _action: PayloadAction<AddClientAndPurchasePayload>
    ) {
      state.loading = true;
    },
    addClientAndPurchaseSuccess(state) {
      state.loading = false;
    },
    addClientAndPurchaseFailure(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload || "Error adding client";
      state.loading = false;
    },

    // === DELETE ===
    deleteClientStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    deleteClientSuccess(state, _action: PayloadAction<number>) {
      state.loading = false;
    },
    deleteClientFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // === CLEAR BONUSES ===
    clearBonusesStart(state, _action: PayloadAction<{ store_id: number }>) {
      state.loading = true;
    },
    clearBonusesSuccess(state) {
      state.loading = false;
    },
    clearBonusesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchClientsStart,
  fetchClientsSuccess,
  fetchClientsFailure,
  addClientAndPurchaseStart,
  addClientAndPurchaseSuccess,
  addClientAndPurchaseFailure,
  deleteClientStart,
  deleteClientSuccess,
  deleteClientFailure,
  clearBonusesStart,
  clearBonusesSuccess,
  clearBonusesFailure,
} = clientSlice.actions;

export default clientSlice.reducer;
