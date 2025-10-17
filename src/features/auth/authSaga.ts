import { call, put, takeLatest } from "redux-saga/effects";
import { getMeFailure, getMeStart, getMeSuccess, loginFailure, loginStart, loginSuccess} from "./authSlice";
import type { UserInfo } from "./authSlice";

import { getMe, loginUser,} from "./authServices";
import type { VerifyResponse } from "./authServices";


function* handleLogin(action: ReturnType<typeof loginStart>) {
    try {
        const data: VerifyResponse = yield call<any>(loginUser, action.payload);

        yield put(loginSuccess(data));

        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
    }
    catch (err: any) {
        yield put(loginFailure(err.message))
    }
}

function* handleGetMe() {
    try {
        const data: UserInfo= yield call(getMe);
        yield put(getMeSuccess(data));
    } catch (err: any) {
        yield put(getMeFailure(err.message));
    }
}

export default function* authSaga() {
    yield takeLatest(loginStart.type, handleLogin);
    yield takeLatest(loginSuccess.type, handleGetMe);
    yield takeLatest(getMeStart.type, handleGetMe);
}
