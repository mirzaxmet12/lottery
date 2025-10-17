import { createSlice, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Purchase {
  id: number;
  client: { id: number; full_name: string; phone_number: string };
  amount: string;
  bonus_awarded: number;
  store: { id: number; name: string };
}

interface PurchaseState {
  purchases: Purchase[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseState = {
  purchases: [],
  loading: false,
  error: null,
};

const purchaseSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    createPurchaseStart: (
      state,
      _action: PayloadAction<{ client: number; store: number; amount: number }>
    ) => {
      state.loading = true;
    },
    createPurchaseSuccess: (state, action: PayloadAction<Purchase>) => {
      state.loading = false;
      state.purchases.unshift(action.payload);
    },
    createPurchaseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { createPurchaseStart, createPurchaseSuccess, createPurchaseFailure } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;
