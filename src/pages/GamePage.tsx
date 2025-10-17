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
  IconButton,
  Menu,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Pagination,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Add, Delete, MoreVert } from "@mui/icons-material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  fetchGamesStart,
  activateGameStart,
  lockGameStart,
  deleteGameStart,
  createGameStart,
  fetchWinnersStart,
  startGameStart,
  updateGameStart,
} from "../features/game/gameSlice";
import { fetchStoresStart } from "../features/store/storeSlice";
import axios from "../service/axios";
import { useNavigate } from "react-router-dom";

type Prize = {
  id?: number;
  name: string;
  type: string;
  quantity: number;
  image?: File | null;
  preview?: string;
  ordering?: number;
};

type FormState = {
  name: string;
  store: string;
  all_clients: boolean;
  from_bonus: string;
  to_bonus: string;
  prizes: Prize[];
};

const initialForm: FormState = {
  name: "",
  store: "",
  all_clients: false,
  from_bonus: "",
  to_bonus: "",
  prizes: [
    {
      id: undefined,
      name: "",
      type: "money",
      quantity: 1,
      image: null,
      preview: "",
      ordering: 1,
    },
  ],
};

const GamesPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { games, count, winners } = useSelector((s: RootState) => s.games);
  const { stores } = useSelector((s: RootState) => s.stores);

  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStore, setFilterStore] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openWinners, setOpenWinners] = useState(false);

  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    // dispatch(fetchGamesStart("?page=1"));
    handleFetch(page)
    dispatch(fetchStoresStart());
  }, [dispatch]);

  const handleFetch = (pageNum: number) => {
    let query = `?page=${pageNum}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (filterStore) query += `&store=${encodeURIComponent(filterStore)}`;
    if (filterStatus) query += `&status=${encodeURIComponent(filterStatus)}`;
    dispatch(fetchGamesStart(query));
    setPage(pageNum);
  };

  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(e.currentTarget);
    setSelectedGameId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActivate = () => {
    if (selectedGameId) dispatch(activateGameStart(selectedGameId));
    handleMenuClose();
  };
  const handleLock = () => {
    if (selectedGameId) dispatch(lockGameStart(selectedGameId));
    handleMenuClose();
  };
  const handleDelete = () => {
    if (selectedGameId && window.confirm("O‘yin o‘chirilsinmi?")) {
      dispatch(deleteGameStart(selectedGameId));
    }
    handleMenuClose();
  };

  const handleSearch = () => handleFetch(1);
  const handlePageChange = (_: any, value: number) => handleFetch(value);

  //  Start Game
  const handleStartGame = (id: number) => {
    dispatch(startGameStart(id));
    navigate(`/games/${id}/play`);
  };

  // 🔹 Add modal
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    // revoke any created blob URLs to avoid leaks
    form.prizes.forEach((p) => {
      if (p.preview && p.preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(p.preview);
        } catch {
          /* ignore */
        }
      }
    });

    setOpenAdd(false);
    setForm(initialForm);
  };

  // 🔹 Edit modal
  const handleOpenEdit = async (id: number) => {
    try {
      const { data } = await axios.get(`/game-api/games/${id}/`);
      setForm({
        name: data.name || "",
        store: data.store?.id?.toString() || "",
        all_clients: data.all_clients ?? false,
        from_bonus: data.from_bonus?.toString() ?? "",
        to_bonus: data.to_bonus?.toString() ?? "",
        prizes:
          data.prizes?.map((p: any) => ({
            id: p.id,
            name: p.name,
            type: p.type,
            quantity: p.quantity,
            image: null,
            preview: p.image || "",
            ordering: p.ordering ?? 1,
          })) || [],
      });

      setSelectedGameId(id);
      setOpenEdit(true);
      handleMenuClose();
    } catch (err) {
      console.error("Failed to load game:", err);
      alert("O‘yinni yuklashda xatolik yuz berdi");
    }
  };
  const handleCloseEdit = () => setOpenEdit(false);

  // G‘oliblar
  const handleOpenWinners = (id: number) => {
    dispatch(fetchWinnersStart(id));
    setSelectedGameId(id);
    setOpenWinners(true);
    handleMenuClose();
  };
  const handleCloseWinners = () => setOpenWinners(false);

  // 🔹 Sovrin 
  const handlePrizeChange = (index: number, field: keyof Prize, value: any) => {
    const updated = [...form.prizes];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, prizes: updated });
  };

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...form.prizes];

    // revoke previous blob preview if needed
    const prev = updated[index]?.preview;
    if (prev && prev.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(prev);
      } catch {
        /* ignore */
      }
    }

    updated[index] = {
      ...updated[index],
      image: file,
      preview: file ? URL.createObjectURL(file) : "",
    };
    setForm({ ...form, prizes: updated });
  };

  const addPrize = () => {
    setForm((f) => ({
      ...f,
      prizes: [
        ...f.prizes,
        { id: undefined, name: "", type: "money", quantity: 1, image: null, preview: "", ordering: f.prizes.length + 1 },
      ],
    }));
  };

  const removePrize = (index: number) => {
    const removed = form.prizes[index];
    if (removed?.preview && removed.preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(removed.preview);
      } catch {
        /* ignore */
      }
    }
    const updated = form.prizes.filter((_, i) => i !== index);
    setForm({ ...form, prizes: updated });
  };

  // 🔹 Yaratish
  const handleSaveGame = () => {
    const { name, store, from_bonus, to_bonus, prizes, all_clients } = form;
    if (!name || !store) return alert("Nom va do‘kon tanlanishi kerak!");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("store", store);
    fd.append("all_clients", all_clients ? "true" : "false");
    if (from_bonus) fd.append("from_bonus", String(from_bonus));
    if (to_bonus) fd.append("to_bonus", String(to_bonus));

    prizes.forEach((p, i) => {
      fd.append(`prizes[${i}]name`, p.name);
      fd.append(`prizes[${i}]type`, p.type);
      fd.append(`prizes[${i}]quantity`, String(p.quantity));
      fd.append(`prizes[${i}]ordering`, String(p.ordering ?? i + 1));
      if (p.image) fd.append(`prizes[${i}]image`, p.image);
    });

    dispatch(createGameStart(fd));
    handleCloseAdd();
  };

  // 🔹 Yangilash
  const handleUpdateGame = () => {
    if (!selectedGameId) return alert("Hech qanday o‘yin tanlanmagan");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("store", form.store);
    if (form.from_bonus) fd.append("from_bonus", String(form.from_bonus));
    if (form.to_bonus) fd.append("to_bonus", String(form.to_bonus));
    fd.append("all_clients", form.all_clients ? "true" : "false");

    form.prizes.forEach((p, i) => {
      if (p.id) fd.append(`prizes[${i}]id`, String(p.id));
      fd.append(`prizes[${i}]name`, p.name);
      fd.append(`prizes[${i}]type`, p.type);
      fd.append(`prizes[${i}]quantity`, String(p.quantity));
      if (p.image) fd.append(`prizes[${i}]image`, p.image);
    });

    dispatch(updateGameStart({ id: selectedGameId, data: fd }));
    setOpenEdit(false);
  };

  // pageCount safe
  const pageCount = Math.max(1, Math.ceil((count || 0) / 10));
console.log(count);
console.log(pageCount);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        🎮 O‘yinlar
      </Typography>

      {/* 🔹 Filtrlar */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField label="Qidiruv" value={search} onChange={(e) => setSearch(e.target.value)} />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Do‘kon</InputLabel>
          <Select
            native
            value={filterStore}
            onChange={(e) => setFilterStore((e.target as HTMLSelectElement).value)}
          >
            <option value=""></option>
            {stores.map((s: any) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            native
            value={filterStatus}
            onChange={(e) => setFilterStatus((e.target as HTMLSelectElement).value)}
          >
            <option value=""></option>
            <option value="draft">Qoralama</option>
            <option value="active">Faol</option>
            <option value="finished">Tugagan</option>
            <option value="locked">Bloklangan</option>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSearch}>
          Qidirish
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setSearch("");
            setFilterStore("");
            setFilterStatus("");
            handleFetch(1);
          }}
        >
          Tozalash
        </Button>

        <Box flexGrow={1} />
        <Button variant="contained" color="success" startIcon={<Add />} onClick={handleOpenAdd}>
          + O‘yin yaratish
        </Button>
      </Box>

      {/* 🔹 Jadval */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>O‘yin nomi</TableCell>
            <TableCell>Do‘kon</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Sovrinlar</TableCell>
            <TableCell>Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((g: any, i: number) => (
            <TableRow key={g.id}>
              <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
              <TableCell>{g.name}</TableCell>
              <TableCell>{g.store?.name}</TableCell>
              <TableCell>
                <Chip
                  label={
                    g.status === "draft"
                      ? "Qoralama"
                      : g.status === "finished"
                      ? "Tugagan"
                      : g.status === "locked"
                      ? "Bloklangan"
                      : "Faol"
                  }
                  color={
                    g.status === "draft" ? "default" : g.status === "active" ? "success" : g.status === "locked" ? "warning" : "error"
                  }
                />
              </TableCell>
              <TableCell>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {g.prizes?.map((p: any, pi: number) => (
                    <Box
                      key={p.id ?? `${g.id}-prize-${pi}`}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        padding: "2px 6px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      {p.image && (
                        <img src={p.image} alt={p.name} width={30} height={30} style={{ borderRadius: "4px", objectFit: "cover" }} />
                      )}
                      <Typography variant="body2">{p.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </TableCell>

              <TableCell>
                <IconButton onClick={(e) => handleMenuOpen(e, g.id)}>
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 🔹 Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
      </Box>

      {/* 🔹 Menu */}
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            if (selectedGameId) handleStartGame(selectedGameId);
          }}
        >
          🎮 O‘yinni boshlash
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedGameId) handleOpenWinners(selectedGameId);
          }}
        >
          🏆 G‘oliblarni ko‘rish
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedGameId) handleOpenEdit(selectedGameId);
          }}
        >
          <EditNoteRoundedIcon />Tahrirlash
        </MenuItem>
        <MenuItem onClick={handleActivate}>
          <LockOpenRoundedIcon />Aktivlashtirish
        </MenuItem>
        <MenuItem onClick={handleLock}>
          <LockIcon /> Bloklash
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
          <Delete /> O‘chirish
        </MenuItem>
      </Menu>

      {/* 🏆 G‘oliblar modali */}
      <Dialog open={openWinners} onClose={handleCloseWinners} fullWidth maxWidth="md">
        <DialogTitle>🏆 G‘oliblar ro‘yxati</DialogTitle>
        <DialogContent>
          {winners.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" mt={2}>
              Hozircha g‘oliblar yo‘q
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>№</TableCell>
                  <TableCell>Ism</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Sovrin</TableCell>
                  <TableCell>Vaqt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {winners.map((w: any, i: number) => (
                  <TableRow key={w.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{w.client.full_name}</TableCell>
                    <TableCell>{w.client.phone_number}</TableCell>
                    <TableCell>{w.prize.name}</TableCell>
                    <TableCell>{new Date(w.awarded_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWinners}>Yopish</Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Add/Edit Modal */}
      <Dialog open={openAdd || openEdit} onClose={openAdd ? handleCloseAdd : handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>{openAdd ? "🕹️ Yangi o‘yin yaratish" : "✏️ O‘yin tahrirlash"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="O‘yin nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <FormControl>
            <InputLabel>Do‘kon</InputLabel>
            <Select native value={form.store} onChange={(e) => setForm({ ...form, store: (e.target as HTMLSelectElement).value })}>
              <option value="">Tanlang</option>
              {stores.map((s: any) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={<Checkbox checked={form.all_clients} onChange={(e) => setForm({ ...form, all_clients: e.target.checked })} />}
              label="Barchaga (all_clients)"
            />
            <TextField label="Bonusdan" type="number" value={form.from_bonus} onChange={(e) => setForm({ ...form, from_bonus: e.target.value })} sx={{ width: 150 }} />
            <TextField label="Bonusgacha" type="number" value={form.to_bonus} onChange={(e) => setForm({ ...form, to_bonus: e.target.value })} sx={{ width: 150 }} />
          </Stack>

          <Typography variant="subtitle1">🎁 Sovrinlar</Typography>
          {form.prizes.map((p, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <TextField label="Nomi" value={p.name} onChange={(e) => handlePrizeChange(index, "name", e.target.value)} />
              <TextField label="Miqdor" type="number" value={p.quantity} onChange={(e) => handlePrizeChange(index, "quantity", Number(e.target.value))} sx={{ width: 100 }} />
              <Button variant="outlined" component="label">
                Rasm
                <input hidden type="file" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files ? e.target.files[0] : null)} />
              </Button>
              {p.preview && (
                <img src={p.preview} alt="preview" width={50} height={50} style={{ borderRadius: 4, objectFit: "cover" }} />
              )}
              <IconButton onClick={() => removePrize(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button onClick={addPrize}>+ Sovrin qo‘shish</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={openAdd ? handleCloseAdd : handleCloseEdit}>Bekor qilish</Button>
          <Button variant="contained" onClick={openAdd ? handleSaveGame : handleUpdateGame}>
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GamesPage;

