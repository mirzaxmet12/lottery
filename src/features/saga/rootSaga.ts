import { all } from "redux-saga/effects";
import LoginSaga from "../auth/authSaga";
import { purchaseSaga } from "../purchase/purchseSaga";
import {clientSaga} from "../client/clientSaga";
import {storeSaga} from "../store/storeSaga";
import {employeeSaga} from "../employee/employeeSaga";
import { gameSaga } from "../game/gameSaga";

export default function* rootSaga() {
    yield all([
        LoginSaga(),
        clientSaga(),
         purchaseSaga(),
         storeSaga(),
         employeeSaga(),
         gameSaga(),

    ])
}