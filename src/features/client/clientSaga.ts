import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../service/axios";
import {
  fetchClientsStart,
  fetchClientsSuccess,
  fetchClientsFailure,
  addClientAndPurchaseStart,
  addClientAndPurchaseSuccess,
  addClientAndPurchaseFailure,
  clearBonusesStart,
  clearBonusesSuccess,
  clearBonusesFailure,
  deleteClientSuccess,
  deleteClientFailure,
  deleteClientStart,
} from "./clientSlice";
import { createPurchaseStart } from "../purchase/purchaseSlice";


// --- 1️⃣ Fetch clients ---
function* handleFetchClients(action: ReturnType<typeof fetchClientsStart>): any {
  try {

    const res = yield call(axios.get, `/game-api/clients/${action.payload}`);
    yield put(fetchClientsSuccess(res.data));
  } catch (error: any) {
    yield put(fetchClientsFailure(error));
  }
}

// --- 2️⃣ Add client + purchase ---
function* handleAddClientAndPurchase(
  action: ReturnType<typeof addClientAndPurchaseStart>
): any {
  try {
    const { full_name, phone_number, amount, store } = action.payload;

    // 🔹 1. create client
    const clientRes = yield call(axios.post, `/game-api/clients/`, {
      full_name,
      phone_number,
    });
    // add purchase
    const client = clientRes.data.id;
    yield put(createPurchaseStart({
      client,
      store,
      amount,
    }))

    yield put(addClientAndPurchaseSuccess());
  } catch (error: any) {
    yield put(addClientAndPurchaseFailure(error));
  }
}

// === DELETE CLIENT ===
function* deleteClientSaga(action: ReturnType<typeof deleteClientStart>): Generator<any, void, any> {
  try {
    yield call(axios.delete, `/game-api/clients/${action.payload}/`);
    yield put(deleteClientSuccess(action.payload));
  } catch (e: any) {
    console.log(e);

    yield put(deleteClientFailure(e));
  }
}

// --- 3️⃣ Clear bonuses ---
function* handleClearBonuses(action: ReturnType<typeof clearBonusesStart>): any {
  try {
    yield call(axios.post, `/game-api/clients/clear-bonuses/`, {
      store_id: action.payload.store_id,
    });
    yield put(clearBonusesSuccess());
    // yield put(fetchClientsStart("")); 
  } catch (error: any) {
    yield put(clearBonusesFailure(error));
  }
}

export function* clientSaga() {
  yield takeLatest(fetchClientsStart.type, handleFetchClients);
  yield takeLatest(addClientAndPurchaseStart.type, handleAddClientAndPurchase);
  yield takeLatest(deleteClientStart.type, deleteClientSaga),

    yield takeLatest(clearBonusesStart.type, handleClearBonuses);
}
