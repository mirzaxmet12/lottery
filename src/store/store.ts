import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../features/saga/rootSaga";
import authSlice from "../features/auth/authSlice";
import clientSlice from "../features/client/clientSlice";
import purchaseSlice from "../features/purchase/purchaseSlice";
import storeSlice from "../features/store/storeSlice";
import employeeSlice from "../features/employee/employeeSlice";
import gameSlice from "../features/game/gameSlice";
import snackbarReducer from "../features/snackbar/snackbarSlice";
import { snackbarMiddleware } from "../features/snackbar/snackbarMiddleware";

const sagaMiddlware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        auth: authSlice,
        clients: clientSlice,
        purchases: purchaseSlice,
        stores: storeSlice,
        employees: employeeSlice,
        games:gameSlice,
        snackbar: snackbarReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddlware).concat(snackbarMiddleware),
    
});

sagaMiddlware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;