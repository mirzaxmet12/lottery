import { call, put, takeLatest } from 'redux-saga/effects';
import axios from '../../service/axios';
import {
  fetchEmployeesStart, fetchEmployeesSuccess, fetchEmployeesFailure,
  addEmployeeStart, addEmployeeSuccess, addEmployeeFailure,
  updateEmployeeStart, updateEmployeeSuccess, updateEmployeeFailure,
  deleteEmployeeStart, deleteEmployeeSuccess, deleteEmployeeFailure,
} from './employeeSlice';
import type { SagaIterator } from 'redux-saga';

function* fetchEmployees(action: ReturnType<typeof fetchEmployeesStart>): SagaIterator {
  try {
    const res = yield call(axios.get, `/game-api/employees/?page=${action.payload}`);
    const data = res.data;
    yield put(fetchEmployeesSuccess({ results: data.results, count: data.count }));
  } catch (err: any) {
    yield put(fetchEmployeesFailure(err));
  }
}

function* addEmployee(action: ReturnType<typeof addEmployeeStart>) {
  try {
    const payload = { ...(action.payload as any) };
    if (!payload.password) payload.password = '1';
    yield call(axios.post, '/game-api/employees/', payload);
    yield put(addEmployeeSuccess());
    yield put(fetchEmployeesStart(''));
  } catch (err: any) {
    yield put(addEmployeeFailure(err));
  }
}

function* updateEmployee(action: ReturnType<typeof updateEmployeeStart>) {
  try {
    const { id, data } = action.payload;
    yield call(axios.put, `/game-api/employees/${id}/`, data);
    yield put(updateEmployeeSuccess());
    yield put(fetchEmployeesStart(''));
  } catch (err: any) {
    yield put(updateEmployeeFailure(err));
  }
}

function* deleteEmployee(action: ReturnType<typeof deleteEmployeeStart>) {
  try {
    yield call(axios.delete, `/game-api/employees/${action.payload}/`);
    yield put(deleteEmployeeSuccess());
    yield put(fetchEmployeesStart(''));
  } catch (err: any) {
    yield put(deleteEmployeeFailure(err));
  }
}

export function* employeeSaga() {
  yield takeLatest(fetchEmployeesStart.type, fetchEmployees);
  yield takeLatest(addEmployeeStart.type, addEmployee);
  yield takeLatest(updateEmployeeStart.type, updateEmployee);
  yield takeLatest(deleteEmployeeStart.type, deleteEmployee);
}
