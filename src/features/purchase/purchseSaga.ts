import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../service/axios";
import {
  createPurchaseStart,
  createPurchaseSuccess,
  createPurchaseFailure,
} from "./purchaseSlice";

function* createPurchaseSaga(action: any): Generator<any, void, any> {
  try {
    const res = yield call(api.post, "/game-api/purchases/", action.payload);
    console.log(res);
    
    yield put(createPurchaseSuccess(res.data));
  } catch (e: any) {
    yield put(createPurchaseFailure(e));
  }
}

export function* purchaseSaga() {
  yield takeLatest(createPurchaseStart.type, createPurchaseSaga);
}
