// src/store/storeSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "../../service/axios";
import {
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
} from "./storeSlice";

function* fetchStores(): Generator<any, void, any> {
  try {
    const res = yield call(axios.get, "/game-api/stores/");
    const data = res?.data?.results ?? res?.data ?? [];
    yield put(fetchStoresSuccess(data));
  } catch (err: any) {
    yield put(fetchStoresFailure(err));
  }
}

function* addStore(action: ReturnType<typeof addStoreStart>): Generator<any, void, any> {
  try {
    yield call(axios.post, "/game-api/stores/", action.payload);
    yield put(addStoreSuccess());
    yield put(fetchStoresStart());
  } catch (err: any) {
    yield put(addStoreFailure(err));
  }
}

function* updateStore(action: ReturnType<typeof updateStoreStart>): Generator<any, void, any> {
  try {
    const { id, ...payload } = action.payload;
    yield call(axios.put, `/game-api/stores/${id}/`, payload);
    yield put(updateStoreSuccess());
    yield put(fetchStoresStart());
  } catch (err: any) {
    yield put(updateStoreFailure(err));
  }
}

function* deleteStore(action: ReturnType<typeof deleteStoreStart>): Generator<any, void, any> {
  try {
    yield call(axios.delete, `/game-api/stores/${action.payload}/`);
    yield put(deleteStoreSuccess());
    yield put(fetchStoresStart());
  } catch (err: any) {
    yield put(deleteStoreFailure(err));
  }
}

export function* storeSaga() {
  yield takeLatest(fetchStoresStart.type, fetchStores);
  yield takeLatest(addStoreStart.type, addStore);
  yield takeLatest(updateStoreStart.type, updateStore);
  yield takeLatest(deleteStoreStart.type, deleteStore);
}
