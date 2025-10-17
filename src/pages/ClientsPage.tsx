import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  fetchClientsStart,
  addClientAndPurchaseStart,
  deleteClientStart,
  clearBonusesStart,
} from "../features/client/clientSlice";
import { fetchStoresStart } from "../features/store/storeSlice";
import { createPurchaseStart } from "../features/purchase/purchaseSlice";
import { Delete } from "@mui/icons-material";

const ClientsPage = () => {

  const dispatch = useDispatch();
  const authUser = useSelector((s: RootState) => s.auth.user);

  const effectiveStoreId = authUser && authUser.role !== "superadmin" ? authUser.store?.id : undefined;
  // const storeName = authUser && authUser.role !== "superadmin" ? authUser.store?.name : undefined;

  const { clients, count } = useSelector((s: RootState) => s.clients);
  const { stores } = useSelector((s: RootState) => s.stores);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Add / Purchase dialogs
  const [openAdd, setOpenAdd] = useState(false);
  const [openPurchase, setOpenPurchase] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  // Clear bonuses dialog
  const [openClearBonuses, setOpenClearBonuses] = useState(false);
  const [selectedStoreForClear, setSelectedStoreForClear] = useState<string>("");

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    amount: "",
    store_id: "",
  });

  const handleRefresh = () => {
    const base = `?page=${page}&search=${encodeURIComponent(search ?? "")}`;
    const storeQuery =
      typeof effectiveStoreId !== "undefined" ? `&store_id=${effectiveStoreId}` : "";
    dispatch(fetchClientsStart(`${base}${storeQuery}`));
  }

  useEffect(() => {
    handleRefresh()
    dispatch(fetchStoresStart());
  }, [dispatch, page, search, effectiveStoreId]);

  const handleSearch = () => {
    setPage(1);
    handleRefresh()
  };

  const handleOpenAdd = () => {
    const prefillStoreId =
      typeof effectiveStoreId !== "undefined" ? String(effectiveStoreId) : "";
    setForm({
      full_name: "",
      phone_number: "",
      amount: "",
      store_id: prefillStoreId,
    });
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setForm({
      full_name: "",
      phone_number: "",
      amount: "",
      store_id: typeof effectiveStoreId !== "undefined" ? String(effectiveStoreId) : "",
    });
  };

  const handleOpenPurchase = (id: number) => {
    const prefillStoreId =
      typeof effectiveStoreId !== "undefined" ? String(effectiveStoreId) : "";
    setSelectedClient(id);
    setForm((prev) => ({ ...prev, amount: "", store_id: prefillStoreId }));
    setOpenPurchase(true);
  };
  const handleClosePurchase = () => {
    setOpenPurchase(false);
    setSelectedClient(null);
    setForm({
      full_name: "",
      phone_number: "",
      amount: "",
      store_id: typeof effectiveStoreId !== "undefined" ? String(effectiveStoreId) : "",
    });
  };

  const handleSaveAdd = () => {
    const { full_name, phone_number, amount, store_id } = form;
    const finalStoreId =
      typeof effectiveStoreId !== "undefined" ? effectiveStoreId : Number(store_id);

    if (!full_name || !phone_number || !amount || !finalStoreId) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    dispatch(
      addClientAndPurchaseStart({
        full_name,
        phone_number,
        amount: Number(amount),
        store: Number(finalStoreId),
      })
    );
    handleCloseAdd();

    // refresh first page
    setPage(1);
    handleRefresh()
  };

  const remove = (id: number) => {
    if (!window.confirm("Haqiqatan ushbu klientni o‘chirishni xohlaysizmi?")) return;
    dispatch(deleteClientStart(id));

    // refresh after delete (saga may also refresh on success)
    setPage(1);
    handleRefresh()
  };

  const handleSavePurchase = () => {
    const finalStoreId =
      typeof effectiveStoreId !== "undefined" ? effectiveStoreId : Number(form.store_id);

    if (!selectedClient || !form.amount || !finalStoreId) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    dispatch(
      createPurchaseStart({
        client: selectedClient,
        store: Number(finalStoreId),
        amount: Number(form.amount),
      })
    );

    // refresh clients
    handleRefresh()
    handleClosePurchase();
  };

  // Clear bonuses handlers
  const handleOpenClearBonuses = () => {
    // default select for superadmin: none, for store_admin: prefill
    const prefill = typeof effectiveStoreId !== "undefined" ? String(effectiveStoreId) : "";
    setSelectedStoreForClear(prefill);
    setOpenClearBonuses(true);
  };

  const handleCloseClearBonuses = () => {
    setOpenClearBonuses(false);
    setSelectedStoreForClear(typeof effectiveStoreId !== "undefined" ? String(effectiveStoreId) : "");
  };

  const handleConfirmClearBonuses = () => {
    const storeIdToClear =
      typeof effectiveStoreId !== "undefined"
        ? effectiveStoreId
        : Number(selectedStoreForClear || 0);

    if (!storeIdToClear) {
      alert("Iltimos, do'konni tanlang!");
      return;
    }

    dispatch(clearBonusesStart({ store_id: Number(storeIdToClear) }));

    handleRefresh()

    handleCloseClearBonuses();
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    handleRefresh()
  };

  const totalPages = Math.max(1, Math.ceil((count || 0) / 10)); // API returns 10 per page
  const storeSelectDisabled :boolean =authUser ? authUser.role !== "superadmin" : false;

  const renderBonusesForClient = (c: any) => {
    const storesArr = c.stores ?? [];
    if (!storesArr.length) return <span>-</span>;

    return (
      <Stack direction="column" spacing={0.5}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {storesArr.map((st: any) => {
            const name = st?.name ?? st?.address ?? `Store ${st?.id ?? ""}`;
            const bonus = st?.current_bonuses ?? 0;
            return (
              <Tooltip key={name + bonus} title={`${name}: ${bonus}`}>
                <Chip size="small" label={`${name}: ${bonus}`} sx={{ mr: 0.5, mb: 0.5 }} />
              </Tooltip>
            );
          })}
        </Stack>
      </Stack>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Klientlar boshqaruvi
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Qidirish (Ism yoki telefon)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Qidirish
        </Button>
        <Button variant="contained" color="success" onClick={handleOpenAdd}>
          + Klient qo'shish
        </Button>
        <Button variant="outlined" color="warning" onClick={handleOpenClearBonuses}>
          Bonuslarni tozalash
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ism</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell>Xaridlar soni</TableCell>
            <TableCell>Jami xarajat</TableCell>
            <TableCell>Bonuslar (current + name)</TableCell>
            <TableCell>Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.full_name}</TableCell>
              <TableCell>{c.phone_number}</TableCell>
              <TableCell>{c.global_summary?.purchases_count ?? 0}</TableCell>
              <TableCell>{c.global_summary?.total_spent ?? 0}</TableCell>
              <TableCell>{renderBonusesForClient(c)}</TableCell>
              <TableCell>
                <Button size="small" variant="outlined" onClick={() => handleOpenPurchase(c.id)}>
                  +
                </Button>
                <IconButton color="error" onClick={() => remove(c.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {count > 10 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      )}

      {/* Add Client Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Yangi klient qo‘shish</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 400 }}>
          <TextField label="Ism" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <TextField label="Telefon" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
          <TextField label="Xarid summasi (so‘m)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <FormControl>
            <InputLabel>Store tanlang</InputLabel>
            <Select value={form.store_id} label="Store tanlang" onChange={(e) => setForm({ ...form, store_id: String(e.target.value) })}
             disabled={storeSelectDisabled}
            >                 
                    {stores.map((st: any) => (
                      <MenuItem key={st.id} value={String(st.id)}>
                        {st.name}
                      </MenuItem>
                    ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Bekor qilish</Button>
          <Button onClick={handleSaveAdd} variant="contained" color="success">Saqlash</Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Dialog */}
      <Dialog open={openPurchase} onClose={handleClosePurchase}>
        <DialogTitle>Xarid qo‘shish</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Xarid summasi (so‘m)"
            type="number" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <FormControl>
            <InputLabel>Store tanlang</InputLabel>
            <Select value={form.store_id}
              label="Store tanlang" onChange={(e) => setForm({ ...form, store_id: String(e.target.value) })}
              disabled={storeSelectDisabled}
            >
              {stores.map((st) => (
                  <MenuItem key={st.id} value={String(st.id)}>
                    {st.name}
                  </MenuItem>
                ))}

            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePurchase}>Bekor qilish</Button>
          <Button onClick={handleSavePurchase} variant="contained" color="success">Saqlash</Button>
        </DialogActions>
      </Dialog>

      {/* Clear Bonuses Dialog */}
      <Dialog open={openClearBonuses} onClose={handleCloseClearBonuses}>
        <DialogTitle>Bonuslarni tozalash</DialogTitle>
        <DialogContent sx={{ minWidth: 380 }}>
          {authUser?.role === "superadmin" ? (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Doʻkonni tanlang</InputLabel>
              <Select value={selectedStoreForClear} label="Doʻkonni tanlang" onChange={(e) => setSelectedStoreForClear(String(e.target.value))}>
                <MenuItem value="">
                  <em>Tanlanmagan</em>
                </MenuItem>
                {stores.map((st: any) => (
                  <MenuItem key={st.id} value={String(st.id)}>
                    {st.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography sx={{ mt: 1 }}>
              Bonuslarni tozalash faqat sizning doʻkoningiz ({stores.find((s: any) => s.id === effectiveStoreId)?.name ?? effectiveStoreId}) uchun amalga oshiriladi.
            </Typography>
          )}
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Diqqat: bu amal barcha mijozlarining joriy bonuslarini tanlangan doʻkonda 0 ga oʻtkazadi.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClearBonuses}>Bekor qilish</Button>
          <Button color="error" variant="contained" onClick={handleConfirmClearBonuses}>
            Tozalash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsPage;
