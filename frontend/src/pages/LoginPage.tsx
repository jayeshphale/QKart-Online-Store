/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Stack,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider
} from "@mui/material/styles";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { authHelper } from "../utils/authHelper";

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { isDarkMode } = useTheme();
  const { reloadSession } = useAuth();

  // Create dynamic Material UI Theme matching our App's color palette & dark state
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: "#f97316", // tailwind orange-500
          },
          background: {
            default: isDarkMode ? "#09090b" : "#fafafa",
            paper: isDarkMode ? "#18181b" : "#ffffff",
          },
          text: {
            primary: isDarkMode ? "#f4f4f5" : "#18181b",
            secondary: isDarkMode ? "#a1a1aa" : "#71717a",
          },
        },
        typography: {
          fontFamily: `"Inter", "ui-sans-serif", "system-ui", "-apple-system", sans-serif`,
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [isDarkMode]
  );

  // Controlled form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Snackbar notifications state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info" | "warning"
  });

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateForm = (): boolean => {
    // Validate Username
    if (!username.trim()) {
      setSnackbar({
        open: true,
        message: "Username is required.",
        severity: "error"
      });
      return false;
    }

    // Validate Password
    if (!password) {
      setSnackbar({
        open: true,
        message: "Password is required.",
        severity: "error"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine base URL dynamically
      let API_URL = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      if (API_URL.includes("localhost:5000") || API_URL.includes("127.0.0.1:5000")) {
        API_URL = "/api/v1";
      }

      const response = await axios.post(`${API_URL}/auth/login`, {
        username: username.trim(),
        password: password
      });

      if (response.data && response.status === 200) {
        // Success handling
        const { token, username: resUsername, walletBalance, addresses } = response.data;
        
        // Store JWT token in localStorage, store username, store login status using helper
        authHelper.saveLoginSession(token, resUsername, walletBalance, addresses);

        // Sync React context state
        reloadSession();

        setSnackbar({
          open: true,
          message: "Logged in successfully",
          severity: "success"
        });

        // Navigate to the preserved intended destination or products page after a short delay
        setTimeout(() => {
          const redirectTo = sessionStorage.getItem("qkart_redirect_to");
          if (redirectTo) {
            sessionStorage.removeItem("qkart_redirect_to");
            // Set the hash directly to navigate to the exact sub-route
            window.location.hash = redirectTo;
          } else {
            navigate("products");
          }
        }, 1200);
      }
    } catch (err: any) {
      if (!err.response) {
        // Network Error or server is down / not reachable
        setSnackbar({
          open: true,
          message: "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          severity: "error"
        });
      } else if (err.response.status === 401) {
        // 401 Error
        setSnackbar({
          open: true,
          message: "Invalid username or password.",
          severity: "error"
        });
      } else {
        // Other errors (like 400) - show backend error message
        const errMsg = err.response?.data?.message || err.message || "An error occurred during login.";
        setSnackbar({
          open: true,
          message: errMsg,
          severity: "error"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Container maxWidth="sm" sx={{ py: 6 }} id="login-page-container">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: "background.paper",
            transition: "all 0.3s ease-in-out"
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Header Icon */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
                color: "white",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px 0 rgba(249, 115, 22, 0.3)"
              }}
            >
              <LoginIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography component="h1" variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.5px", color: "text.primary" }}>
              Welcome Back to QKart
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4, textAlign: "center" }}>
              Login to your organic supermarket account to access your cart, addresses, and place orders.
            </Typography>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
              <Stack spacing={3}>
                
                {/* Username Field */}
                <TextField
                  required
                  fullWidth
                  id="login-username-input"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }
                  }}
                />

                {/* Password Field */}
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="login-password-input"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                />

                {/* Submit button "Login Now" */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                    background: "linear-gradient(90deg, #f97316 0%, #f59e0b 100%)",
                    boxShadow: "0 4px 12px 0 rgba(249, 115, 22, 0.2)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #ea580c 0%, #d97706 100%)",
                    }
                  }}
                  id="login-submit-btn"
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login Now"
                  )}
                </Button>

              </Stack>
            </Box>

            {/* Link redirection */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Button
                  onClick={() => navigate("register")}
                  sx={{
                    fontWeight: "bold",
                    color: "#ea580c",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    ml: 0.5,
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "transparent"
                    }
                  }}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: "14px !important" }} />}
                  id="login-register-redirect-btn"
                >
                  Register here
                </Button>
              </Typography>
            </Box>

          </Box>
        </Paper>

        {/* Snackbar notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </MuiThemeProvider>
  );
};
