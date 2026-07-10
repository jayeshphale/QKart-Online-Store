/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Stack,
  IconButton,
  Rating,
  Chip,
  createTheme,
  ThemeProvider as MuiThemeProvider
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutlined as ErrorIcon
} from "@mui/icons-material";
import { Product } from "../types";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface ProductDetailsPageProps {
  productId: string;
  navigate: (path: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId, navigate }) => {
  const { fetchProductById, error: productContextError } = useProducts();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  // Local error state for Snackbar
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);

  // Material UI theme matching light/dark mode
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: "#f97316", // QKart orange
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

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProductById(productId);
        if (data) {
          setProduct(data);
        } else {
          setErrorMessage("Product not found");
          setErrorOpen(true);
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to fetch product details due to API or Network error.");
        setErrorOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [productId, fetchProductById]);

  // Synchronize product context fetch errors
  useEffect(() => {
    if (productContextError) {
      setErrorMessage(productContextError);
      setErrorOpen(true);
    }
  }, [productContextError]);

  const handleQtyChange = (change: number) => {
    if (!product) return;
    const target = quantity + change;
    // Quantity should never go below 1 or exceed available stock (if stock > 0)
    if (target >= 1 && (product.stock <= 0 || target <= product.stock)) {
      setQuantity(target);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      showNotification("Please login first.", "warning");
      navigate("login");
      return;
    }

    setIsAdding(true);
    const res = await addToCart(product, quantity);
    setIsAdding(false);

    if (res.success) {
      showNotification("Item added to cart.", "success");
    } else {
      showNotification(res.message, "warning");
    }
  };

  const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };

  if (isLoading) {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Box
          id="details-loader"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            py: 12,
            gap: 2
          }}
        >
          <CircularProgress color="primary" size={48} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
            Loading product details...
          </Typography>
        </Box>
      </MuiThemeProvider>
    );
  }

  const isOutOfStock = !product || product.stock <= 0;

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Container maxWidth="lg" sx={{ py: 2 }} id="product-details-container">
        {/* Navigation / Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("products")}
            id="details-back-btn"
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" }
            }}
          >
            Back to Catalog
          </Button>
        </Box>

        {!product ? (
          /* Error / Product Not Found Layout */
          <Paper
            elevation={0}
            id="details-not-found"
            sx={{
              p: 6,
              borderRadius: 5,
              border: "1px dashed",
              borderColor: "divider",
              textAlign: "center",
              bgcolor: isDarkMode ? "rgba(24, 24, 27, 0.4)" : "#fafafa",
            }}
          >
            <Box sx={{ display: "inline-flex", p: 2, bgcolor: "error.soft", color: "error.main", borderRadius: "50%", mb: 2 }}>
              <ErrorIcon sx={{ fontSize: 48 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: "black", color: "text.primary", mb: 1 }}>
              Product Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxW: 400, mx: "auto", mb: 4 }}>
              The product you are searching for does not exist or has been removed from the catalog. Let's head back to browse other products.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("products")}
              id="not-found-continue-shopping-btn"
              sx={{ borderRadius: 3, fontWeight: "bold", textTransform: "none", px: 4 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          /* Standard Product Details Layout */
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Left side: Product Image */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  position: "relative",
                  borderRadius: 5,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  aspectRatio: { xs: "1/1", sm: "4/3", md: "1/1" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  referrerPolicy="no-referrer"
                />
                <Chip
                  label={product.category}
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    fontWeight: "bold",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    boxShadow: 2
                  }}
                />
              </Paper>
            </Grid>

            {/* Right side: Information block */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                {/* Category and Stock Indicator */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" sx={{ fontWeight: 850, color: "primary.main", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {product.category}
                  </Typography>
                  <Chip
                    label={isOutOfStock ? "Out of Stock" : `In Stock: ${product.stock} units`}
                    size="small"
                    color={isOutOfStock ? "error" : "success"}
                    variant="outlined"
                    sx={{ fontWeight: "bold", fontSize: "11px" }}
                  />
                </Box>

                {/* Product Title */}
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 900, letterSpacing: "-0.5px" }}>
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, fontWeight: "medium" }}>
                    SKU: QK-{product.id}
                  </Typography>
                </Box>

                {/* Stars and Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating value={product.rating} precision={0.1} readOnly size="medium" />
                  <Typography variant="subtitle2" sx={{ fontWeight: "extrabold", color: "text.primary" }}>
                    {product.rating.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rating
                  </Typography>
                </Box>

                {/* Price Display */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: isDarkMode ? "rgba(249, 115, 22, 0.05)" : "#fff7ed",
                    border: "1px solid",
                    borderColor: isDarkMode ? "rgba(249, 115, 22, 0.15)" : "#ffedd5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: "bold", display: "block" }}>
                      Price
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "success.main" }}>
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      Price Match Guaranteed
                    </Typography>
                  </Box>
                </Paper>

                {/* Full Description */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: "bold", mb: 1, letterSpacing: 0.5 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, color: "text.primary" }}>
                    {product.description}
                  </Typography>
                </Box>

                {/* Divider */}
                <Box sx={{ borderBottom: "1px solid", borderColor: "divider", my: 1 }} />

                {/* Quantity and Actions Row */}
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                      Quantity
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 0.5,
                        bgcolor: "background.paper"
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleQtyChange(-1)}
                        disabled={quantity <= 1 || isOutOfStock}
                        sx={{ color: "text.secondary" }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 2, fontWeight: "extrabold", minWidth: 32, textAlign: "center" }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQtyChange(1)}
                        disabled={isOutOfStock || quantity >= product.stock}
                        sx={{ color: "text.secondary" }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Buttons Group */}
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                      disabled={isAdding || isOutOfStock}
                      id="details-add-to-cart-btn"
                      sx={{
                        flexGrow: 1,
                        borderRadius: 3,
                        fontWeight: "bold",
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "0.95rem",
                        background: "linear-gradient(90deg, #f97316 0%, #f59e0b 100%)",
                        color: "white",
                        "&:hover": {
                          background: "linear-gradient(90deg, #ea580c 0%, #d97706 100%)",
                        }
                      }}
                    >
                      {isOutOfStock ? "Out of Stock" : `Add to Cart`}
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      onClick={() => navigate("products")}
                      id="details-continue-shopping-btn"
                      sx={{
                        borderRadius: 3,
                        fontWeight: "bold",
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "0.95rem"
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* Local Error Snackbars if API or network fails */}
        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%", borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </MuiThemeProvider>
  );
};
