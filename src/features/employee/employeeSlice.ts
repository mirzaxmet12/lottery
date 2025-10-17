import { createSlice, } from '@reduxjs/toolkit';
import type{  PayloadAction } from '@reduxjs/toolkit';


interface Employee {
  id: number;
  phone_number: string;
  full_name: string;
  role: string;
  store?: any;
}

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  count: number;
  currentPage: number;
}

const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
  count: 0,
  currentPage: 1,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchEmployeesStart(state, _action: PayloadAction<string|number>) {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess(state, action: PayloadAction<{ results: Employee[]; count: number;}>) {
      state.employees = action.payload.results;
      state.count = action.payload.count;
      // state.currentPage = action.payload.page;
      state.loading = false;
    },
    fetchEmployeesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    addEmployeeStart(state, _action: PayloadAction<any>) {
      state.loading = true;
    },
    addEmployeeSuccess(state) {
      state.loading = false;
    },
    addEmployeeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateEmployeeStart(state, _action: PayloadAction<{ id: number; data: any }>) {
      state.loading = true;
    },
    updateEmployeeSuccess(state) {
      state.loading = false;
    },
    updateEmployeeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteEmployeeStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    deleteEmployeeSuccess(state) {
      state.loading = false;
    },
    deleteEmployeeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchEmployeesStart, fetchEmployeesSuccess, fetchEmployeesFailure,
  addEmployeeStart, addEmployeeSuccess, addEmployeeFailure,
  updateEmployeeStart, updateEmployeeSuccess, updateEmployeeFailure,
  deleteEmployeeStart, deleteEmployeeSuccess, deleteEmployeeFailure,
} = employeeSlice.actions;

export default employeeSlice.reducer;
