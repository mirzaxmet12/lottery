// src/pages/SettingsPage.tsx
import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import StoresPage from "../pages/StorePage";  
import EmployeesPage from "../pages//EmployesPage";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";

const SettingsPage: React.FC = () => {
  const role = useSelector((s: RootState) => s.auth.user?.role);
  const [tab, setTab] = useState(0);

  const tabs = role === "superadmin"
    ? [{ id: "stores", label: "Stores", node: <StoresPage /> }, { id: "employees", label: "Employees", node: <EmployeesPage /> }]
    : [{ id: "employees", label: "Employees", node: <EmployeesPage /> }];

  useEffect(() => {
    setTab(0);
  }, [role]);

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Settings</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        {tabs.map((t) => <Tab key={t.id} label={t.label} />)}
      </Tabs>

      <Box mt={2}>
        {tabs.map((t, i) => (
          <div key={t.id} style={{ display: tab === i ? "block" : "none" }}>
            {tab === i && t.node}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default SettingsPage;
