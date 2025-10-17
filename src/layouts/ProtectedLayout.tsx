import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../features/auth/authSlice";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GlobalSnackbar from "../components/GlobalSnackbar";

const drawerWidth = 230;

const ProtectedLayout = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems =
    user?.role === "superadmin"
      ? [
        { text: "Клиенты", path: "/superadmin/clients" },
        { text: "Игры", path: "/superadmin/games" },
        { text: "Настройки", path: "/superadmin/settings" },
      ]
      : user?.role === "store_admin" ?
        [
          { text: "Клиенты", path: "/store_admin/clients" },
          { text: "Игры", path: "/store_admin/games" },
          { text: "Настройки", path: "/store_admin/settings" },
        ] 
        : [{text: "Клиенты", path: "/seller/clients" },];

        const isFullScreenRoute = /^\/games\/\d+\/play\/?$/.test(location.pathname);

        if (isFullScreenRoute) {
          return (
            <>
              <Box
                sx={{
                  width: "100%",
                  height: "100vh",
                  // background: "black",
                  overflow: "hidden",
                }}
              >
                {/* Outlet will render GamePlayPage */}
                <Outlet />
              </Box>
              <GlobalSnackbar />
            </>
          );
        }
        
return (
  <>
  <Box
    sx={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(to right, #f5f7fa, #e8ecf1)",
    }}
  >
    {/* Sidebar */}
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          background: "linear-gradient(180deg, #2c3e50, #34495e)",
          color: "#ecf0f1",
          boxShadow: "2px 0 12px rgba(0,0,0,0.2)",
          borderRight: "none",
        },
      }}
    >
      {/* Title */}
      <Toolbar sx={{ justifyContent: "center", mt: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, letterSpacing: 1, color: "#1ABC9C" }}
        >
          {user?.role === "superadmin" ? "Admin Panel" : "Seller Panel"}
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem
                component={Link}
                to={item.path}
                sx={{
                  position: "relative",
                  borderRadius: "8px",
                  mb: 1,
                  mx: 1,
                  color: isActive ? "#1ABC9C" : "#ecf0f1",
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                    transform: "scale(1.02)",
                  },
                }}
              >
                {/* Aktiv chiziq (animatsiyali) */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "5px",
                      background:
                        "linear-gradient(to bottom, #1ABC9C, #16A085)",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: isActive ? 600 : 400,
                        letterSpacing: 0.5,
                      },
                    },
                  }}                
                />
              </ListItem>
            </motion.div>
          );
        })}
      </List>
    </Drawer>

    {/* Main content */}
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={2}
        position="static"
        sx={{
          background: "linear-gradient(90deg, #34495E, #2C3E50)",
          color: "white",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Xalq Danaligi
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#1ABC9C",
                fontWeight: 600,
                boxShadow: "0 0 8px rgba(26,188,156,0.6)",
              }}
            >
              {user?.full_name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ fontWeight: 500 }}>{user?.full_name}</Typography>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderColor: "rgba(255,255,255,0.6)",
                "&:hover": {
                  borderColor: "#1ABC9C",
                  backgroundColor: "rgba(26,188,156,0.15)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/*  kontent*/}
      <Box
        sx={{
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  </Box>
  <GlobalSnackbar/>
  </>
);
};

export default ProtectedLayout;
