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
  HowToReg as HowToRegIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { isDarkMode } = useTheme();

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
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation States (Form Errors)
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
    let isValid = true;

    // Reset errors
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate Username
    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      isValid = false;
    }

    // Validate Password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form.",
        severity: "error"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine base URL dynamically (matches `/api/v1` setup)
      let API_URL = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      if (API_URL.includes("localhost:5000") || API_URL.includes("127.0.0.1:5000")) {
        API_URL = "/api/v1";
      }
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: username.trim(),
        password: password
      });

      if (response.data && response.status === 200) {
        setSnackbar({
          open: true,
          message: response.data.message || "Registered Successfully",
          severity: "success"
        });

        // Clear Form fields
        setUsername("");
        setPassword("");
        setConfirmPassword("");

        // Navigate to Login Page after a short delay
        setTimeout(() => {
          navigate("login");
        }, 1500);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      setSnackbar({
        open: true,
        message: errMsg,
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Container maxWidth="sm" sx={{ py: 6 }} id="register-page-container">
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
            {/* Header and Branding */}
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
              <HowToRegIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography component="h1" variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.5px", color: "text.primary" }}>
              Create QKart Account
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4, textAlign: "center" }}>
              Join QKart supermarket today and grab premium groceries & accessories!
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
              <Stack spacing={3}>
                
                {/* Username Input Field */}
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={Boolean(usernameError)}
                  helperText={usernameError}
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

                {/* Password Input Field */}
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(passwordError)}
                  helperText={passwordError}
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

                {/* Confirm Password Input Field */}
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={Boolean(confirmPasswordError)}
                  helperText={confirmPasswordError}
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
                            aria-label="toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                />

                {/* Submit Button */}
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
                  id="register-submit-btn"
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register Account"
                  )}
                </Button>

              </Stack>
            </Box>

            {/* Redirect to Login Link */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Button
                  onClick={() => navigate("login")}
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
                  id="register-login-redirect-btn"
                >
                  Login
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
