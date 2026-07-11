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
import { motion, AnimatePresence } from "motion/react";

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

  // Forgot Password Flow States
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1, 2, or 3
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotTxnId, setForgotTxnId] = useState("");
  const [forgotResetToken, setForgotResetToken] = useState("");
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState("");

  // Forgot Password API Submit Handlers
  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsForgotSubmitting(true);
    setForgotError("");
    setForgotSuccessMessage("");

    try {
      let API_URL = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      if (API_URL.includes("localhost:5000") || API_URL.includes("127.0.0.1:5000")) {
        API_URL = "/api/v1";
      }

      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: forgotEmail.trim()
      });

      if (response.data && response.data.success) {
        setForgotTxnId(response.data.data.transactionId);
        setForgotSuccessMessage("Security OTP code has been generated. Proceeding to verification.");
        setTimeout(() => {
          setForgotSuccessMessage("");
          setForgotStep(2);
        }, 1500);
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || err.message || "Failed to locate credentials.");
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  const handleForgotOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp.trim()) return;
    setIsForgotSubmitting(true);
    setForgotError("");
    setForgotSuccessMessage("");

    try {
      let API_URL = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      if (API_URL.includes("localhost:5000") || API_URL.includes("127.0.0.1:5000")) {
        API_URL = "/api/v1";
      }

      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        transactionId: forgotTxnId,
        otp: forgotOtp.trim()
      });

      if (response.data && response.data.success) {
        setForgotResetToken(response.data.data.resetToken);
        setForgotSuccessMessage("Security code validated successfully. Complete reset below.");
        setTimeout(() => {
          setForgotSuccessMessage("");
          setForgotStep(3);
        }, 1500);
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || err.message || "Invalid verification code.");
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  const handleForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword.length < 6) {
      setForgotError("Password must be at least 6 characters.");
      return;
    }
    setIsForgotSubmitting(true);
    setForgotError("");
    setForgotSuccessMessage("");

    try {
      let API_URL = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      if (API_URL.includes("localhost:5000") || API_URL.includes("127.0.0.1:5000")) {
        API_URL = "/api/v1";
      }

      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        transactionId: forgotTxnId,
        resetToken: forgotResetToken,
        newPassword: forgotNewPassword
      });

      if (response.data && response.data.success) {
        setIsForgotOpen(false);
        setSnackbar({
          open: true,
          message: "Credentials altered successfully! Please login with your new password.",
          severity: "success"
        });
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || err.message || "Credential modification failed.");
    } finally {
      setIsForgotSubmitting(false);
    }
  };

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

                {/* Forgot Password Link */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                  <Button
                    onClick={() => {
                      setForgotError("");
                      setForgotSuccessMessage("");
                      setForgotEmail("");
                      setForgotOtp("");
                      setForgotNewPassword("");
                      setForgotStep(1);
                      setIsForgotOpen(true);
                    }}
                    sx={{
                      fontSize: "12px",
                      textTransform: "none",
                      color: "#71717a",
                      fontWeight: "semibold",
                      "&:hover": {
                        color: "#ea580c",
                        backgroundColor: "transparent",
                        textDecoration: "underline"
                      }
                    }}
                    id="login-forgot-password-btn"
                  >
                    Forgot Password?
                  </Button>
                </Box>

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

        {/* Forgot Password Modal Overlay */}
        <AnimatePresence>
          {isForgotOpen && (
            <div 
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(9, 9, 11, 0.75)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "16px"
              }}
              id="forgot-password-modal-container"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                style={{
                  width: "100%",
                  maxWidth: "440px",
                  backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
                  border: isDarkMode ? "1px solid #27272a" : "1px solid #e4e4e7",
                  borderRadius: "24px",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                    Credential Recovery
                  </Typography>
                  <IconButton 
                    onClick={() => setIsForgotOpen(false)}
                    sx={{ color: "text.secondary" }}
                  >
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>&times;</span>
                  </IconButton>
                </div>

                {/* Info and Progress Steps */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step} 
                      style={{ 
                        flex: 1, 
                        height: "4px", 
                        borderRadius: "2px",
                        backgroundColor: forgotStep >= step ? "#f97316" : (isDarkMode ? "#27272a" : "#e4e4e7"),
                        transition: "background-color 0.3s ease"
                      }} 
                    />
                  ))}
                </div>

                {forgotError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {forgotError}
                  </Alert>
                )}

                {forgotSuccessMessage && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    {forgotSuccessMessage}
                  </Alert>
                )}

                {/* STEP 1: Enter Username/Email */}
                {forgotStep === 1 && (
                  <form onSubmit={handleForgotEmailSubmit}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Enter your account username. We will generate a simulated verification OTP to verify your identity.
                    </Typography>
                    
                    <TextField
                      fullWidth
                      required
                      label="Username or Email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. testuser"
                      sx={{ mb: 3 }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          )
                        }
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isForgotSubmitting}
                      sx={{ py: 1.2, fontWeight: "bold", borderRadius: 2.5 }}
                    >
                      {isForgotSubmitting ? "Generating OTP..." : "Get Verification OTP"}
                    </Button>
                  </form>
                )}

                {/* STEP 2: Verify OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleForgotOtpSubmit}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      A secure transaction ID has been generated. For simulation, please enter the secure OTP code: <b style={{ color: "#ea580c" }}>123456</b>.
                    </Typography>

                    <TextField
                      fullWidth
                      required
                      label="Verification Code (OTP)"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="123456"
                      sx={{ mb: 3 }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          )
                        }
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isForgotSubmitting}
                      sx={{ py: 1.2, fontWeight: "bold", borderRadius: 2.5 }}
                    >
                      {isForgotSubmitting ? "Verifying..." : "Verify Security Code"}
                    </Button>
                  </form>
                )}

                {/* STEP 3: Enter New Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleForgotResetSubmit}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Your security token is verified! Now, choose a secure new password for your account.
                    </Typography>

                    <TextField
                      fullWidth
                      required
                      type="password"
                      label="New Secure Password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      sx={{ mb: 3 }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          )
                        }
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isForgotSubmitting}
                      sx={{ py: 1.2, fontWeight: "bold", borderRadius: 2.5 }}
                    >
                      {isForgotSubmitting ? "Resetting Credentials..." : "Alter Credentials & Reset"}
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
