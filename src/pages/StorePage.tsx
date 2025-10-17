import React, { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  fetchStoresStart,
  addStoreStart,
  updateStoreStart,
  deleteStoreStart,
} from "../features/store/storeSlice";
import { Delete, Edit } from "@mui/icons-material";

const StoresPage: React.FC = () => {
  const dispatch = useDispatch();
  const { stores, loading, error } = useSelector(
    (state: RootState) => state.stores
  );

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", address: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchStoresStart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error, severity: "error" });
    }
  }, [error]);

  const handleOpen = (store?: any) => {
    if (store) {
      setEditId(store.id);
      setForm({ name: store.name, address: store.address });
    } else {
      setEditId(null);
      setForm({ name: "", address: "" });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (editId) {
      dispatch(updateStoreStart({ id: editId, ...form }));
      setSnackbar({ open: true, message: "Store updated successfully!", severity: "success" });
    } else {
      dispatch(addStoreStart(form));
      setSnackbar({ open: true, message: "Store added successfully!", severity: "success" });
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    dispatch(deleteStoreStart(id));
    setSnackbar({ open: true, message: "Store deleted successfully!", severity: "success" });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Stores Management
        </Typography>

        <Button variant="contained" onClick={() => handleOpen()}>
          Add Store
        </Button>
      </Stack>

      {loading && <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>}

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell  align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store) => (
            <TableRow key={store.id}>
              <TableCell>{store.id}</TableCell>
              <TableCell>{store.name}</TableCell>
              <TableCell >{store.address}</TableCell>
              {/* <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleOpen(store)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(store.id)}
                >
                  Delete
                </Button>
              </TableCell> */}
              <TableCell align="right">
                <IconButton onClick={() => handleOpen(store)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(store.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Edit Store" : "Add Store"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoresPage;
