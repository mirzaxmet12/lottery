import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  styled,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, getMeStart } from "../features/auth/authSlice";
import type { RootState } from "../store/store";

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    background: "var(--background-color)",
    color: "var(--text-color)",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "gray",
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    color: "var(--text-color)",
  },
}));

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logging, loginError, accessToken, user } = useSelector(
    (s: RootState) => s.auth
  );

  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart({ phone_number, password }));
  };

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(getMeStart());
    }
  }, [accessToken, dispatch, user]);

  useEffect(() => {
    if (user) {
      if (user.role === "superadmin") {
        navigate("/superadmin/clients", { replace: true });
      }
      else if (user.role === "store_admin") navigate("/store_admin/clients",{ replace: true })
      else if (user.role === "seller") {
        navigate("/seller/clients", { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 380,
        mx: "auto",
        mt: 10,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        background: "var(--main-background-color)",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        С возвращением
      </Typography>

      <StyledTextField
        label="Телефон"
        fullWidth
        required
        margin="normal"
        placeholder="998901234567"
        value={phone_number}
        onChange={(e) => setPhone(e.target.value)}
      />

      <StyledTextField
        label="Пароль"
        type="password"
        fullWidth
        required
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={logging}
        sx={{ mt: 3 }}
      >
        {logging ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Войти"
        )}
      </Button>

      <Snackbar open={!!loginError} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {loginError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
