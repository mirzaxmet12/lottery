import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  fetchEmployeesStart,
  addEmployeeStart,
  updateEmployeeStart,
  deleteEmployeeStart,
} from "../features/employee/employeeSlice";
import { fetchStoresStart } from "../features/store/storeSlice";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Avatar,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Add, Edit, Delete, Person } from "@mui/icons-material";
import { showSnackbar } from "../features/snackbar/snackbarSlice";

const EmployeesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { employees, loading, count } = useSelector(
    (s: RootState) => s.employees
  );
  const storesState = useSelector((s: RootState) => s.stores);
  const authUser = useSelector((s: RootState) => s.auth.user);
console.log(authUser);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    phone_number: "",
    full_name: "",
    role: "seller",
    store: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<any>({});

  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const totalPages = Math.ceil(count / 10);

  const isSuper = authUser?.role === "superadmin";
  const isStoreAdmin = authUser?.role === "store_admin";

  useEffect(() => {
    dispatch(fetchEmployeesStart( page ));
    dispatch(fetchStoresStart());
  }, [dispatch, page]);

  // filter employees according to role
  const filteredEmployees = useMemo(() => {
    if (isSuper) return employees;
    if (isStoreAdmin)
      return employees.filter(
        (e: any) => e.store?.id === authUser?.store?.id
      );
    // seller -> only self
    return employees.filter((e: any) => e.id === authUser?.store.id);
  }, [employees, authUser, isSuper, isStoreAdmin]);

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  // open dialogs
  const openCreate = () => {
    setEditingId(null);
    setForm({
      phone_number: "",
      full_name: "",
      role: isStoreAdmin ? "seller" : "seller",
      store:
        isStoreAdmin && authUser?.store.id
          ? String(authUser.store.id)
          : "",
      password: "",
    });
    setFormErrors({});
    setOpen(true);
  };

  const openEdit = (emp: any) => {
    setEditingId(emp.id);
    setForm({
      phone_number: emp.phone_number ?? "",
      full_name: emp.full_name ?? "",
      role: emp.role ?? "seller",
      store:
        emp.store && typeof emp.store === "object"
          ? String(emp.store.id ?? "")
          : String(emp.store ?? ""),
      password: "",
    });
    setOpen(true);
  };

  const close = () => setOpen(false);

  const validate = (): { valid: boolean; errors: any } => {
    const errors: any = {};
    if (!form.phone_number) errors.phone_number = "Telefon raqam kiritilmagan";
    if (!form.full_name) errors.full_name = "Ism kiritilmagan";
    if (!editingId && !form.password)
      errors.password = "Parol kiritilishi kerak";
    return { valid: Object.keys(errors).length === 0, errors };
  };

  const isFormValid = useMemo(() => validate().valid, [form, editingId]);

  const save = () => {
    const { valid, errors } = validate();
    setFormErrors(errors);
    if (!valid) {
      showSnackbar({
        message: "Form to‘liq emas",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);
    const payload: any = {
      phone_number: form.phone_number,
      full_name: form.full_name,
      role: form.role,
    };
    if (form.store) payload.store = Number(form.store);
    if (form.password) payload.password = form.password;

    if (editingId) {
      dispatch(updateEmployeeStart({ id: editingId, data: payload }));
      // setSnackbar({ open: true, message: "Yangilandi", severity: "success" });
    } else {
      dispatch(addEmployeeStart(payload));
      // setSnackbar({ open: true, message: "Qo‘shildi", severity: "success" });
    }

    setTimeout(() => {
      setSubmitting(false);
      close();
    }, 400);
  };

  const remove = (id: number, emp: any) => {
    if (
      window.confirm("Haqiqatan o‘chirilsinmi?") &&
      (isSuper ||
        (isStoreAdmin && emp.store?.id === authUser?.store.id))
    ) {
      dispatch(deleteEmployeeStart(id));
      // setSnackbar({ open: true, message: "O‘chirildi", severity: "success" });
    } 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <Person />
          </Avatar>
          <Typography variant="h6">Employees</Typography>
        </Stack>

        {(isSuper || isStoreAdmin) && (
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={openCreate}
          >
            Add Employee
          </Button>
        )}
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Store</TableCell>
                {(isSuper || isStoreAdmin) && (
                  <TableCell align="right">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp: any) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.phone_number}</TableCell>
                  <TableCell>{emp.full_name}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>
                    {emp.store?.name || emp.store?.address || "-"}
                  </TableCell>
                  {(isSuper ||
                    (isStoreAdmin &&
                      emp.store?.id === authUser?.store.id)) && (
                    <TableCell align="right">
                      <IconButton onClick={() => openEdit(emp)}>
                        <Edit />
                      </IconButton>
                      {(isSuper ||
                        (isStoreAdmin &&
                          emp.store?.id === authUser?.store.id &&
                          emp.role === "seller")) && (
                        <IconButton
                          color="error"
                          onClick={() => remove(emp.id, emp)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Stack alignItems="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}

      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Phone number"
              fullWidth
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
              error={!!formErrors.phone_number}
              helperText={formErrors.phone_number}
            />
            <TextField
              label="Full name"
              fullWidth
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
              error={!!formErrors.full_name}
              helperText={formErrors.full_name}
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as any })
                }
                disabled={isStoreAdmin}
              >
                <MenuItem value="seller">Seller</MenuItem>
                {isSuper && (
                  <MenuItem value="store_admin">Store admin</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Store</InputLabel>
              <Select
                value={form.store}
                onChange={(e) =>
                  setForm({ ...form, store: e.target.value })
                }
                disabled={isStoreAdmin}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {storesState?.stores?.map((st: any) => (
                  <MenuItem key={st.id} value={String(st.id)}>
                    {st.name ?? st.address ?? st.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={editingId ? "Password (optional)" : "Password *"}
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={!isFormValid || submitting}
            startIcon={submitting ? <CircularProgress size={18} /> : null}
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

     
    </Box>
  );
};

export default EmployeesPage;
