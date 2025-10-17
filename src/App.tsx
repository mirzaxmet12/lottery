import  { useEffect } from "react";
import {  Routes, Route } from "react-router-dom";
import {  useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";

import LoginPage from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { getMeStart } from "./features/auth/authSlice";
import GamesPage from "./pages/GamePage";
import ClientsPage from "./pages/ClientsPage";
import SettingsPage from "./pages/settingsPage";
import GamePlayPage from "./pages/GamePlayPage";
import StoresPage from "./pages/StorePage";
import EmployeesPage from "./pages/EmployesPage";

function App() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((s: RootState) => s.auth);


  useEffect(() => {

    console.log(user);
    if (accessToken && !user) {
      dispatch(getMeStart())
    };
  }, [accessToken, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        {/* SUPERADMIN ROUTES */}
        <Route
          path="/superadmin/clients"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/games"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <GamesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/settings"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/store"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <StoresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/employee"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />

        {/* SELLER ROUTES */}
        <Route
          path="/store_admin/clients"
          element={
            <ProtectedRoute allowedRoles={["store_admin"]}>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store_admin/games"
          element={
            <ProtectedRoute allowedRoles={["store_admin"]}>
              <GamesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store_admin/settings"
          element={
            <ProtectedRoute allowedRoles={["store_admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/clients"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/games/:id/play" element={<GamePlayPage />} />
      </Route>

    </Routes>
  );
};

export default App;
