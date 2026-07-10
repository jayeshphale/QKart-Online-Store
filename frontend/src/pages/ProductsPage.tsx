/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Skeleton,
  Snackbar,
  Alert,
  Paper,
  Button,
  Stack
} from "@mui/material";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider
} from "@mui/material/styles";
import {
  LocalMall as LocalMallIcon,
  SentimentDissatisfied as SadIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import { useProducts } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";

interface ProductsPageProps {
  navigate: (path: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ navigate }) => {
  const { isDarkMode } = useTheme();
  const {
    products,
    categories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSort,
    setSelectedSort,
    fetchProducts
  } = useProducts();

  // Create dynamic Material UI Theme matching our App's color palette & dark state
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: "#f97316", // QKart orange-500
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

  // Snackbar state for API/Fetch failure
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Trigger snackbar on context error
  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  // Initial products fetch on mount to ensure freshness
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedSort("");
    setSearchQuery("");
    fetchProducts("", "All", "");
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Container maxWidth="lg" sx={{ py: 3 }} id="products-page-mui-container">
        <Stack spacing={4}>
          
          {/* Hero Banner Area */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 5,
              background: isDarkMode
                ? "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)"
                : "linear-gradient(135deg, #ffedd5 0%, #fee2e2 100%)",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              position: "relative",
              overflow: "hidden"
            }}
            id="products-hero-banner"
          >
            <Box sx={{ zIndex: 1, maxW: { md: "60%" } }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  mb: 2,
                  boxShadow: "0 4px 10px rgba(249, 115, 22, 0.2)"
                }}
              >
                <LocalMallIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  QKart Organic Supermarket
                </Typography>
              </Box>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 900,
                  color: isDarkMode ? "white" : "zinc.900",
                  letterSpacing: "-1px",
                  lineHeight: 1.2,
                  mb: 1
                }}
              >
                Fresh Produce & Premium Gadgets
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? "zinc.300" : "zinc.600",
                  fontSize: "0.875rem"
                }}
              >
                Sourced directly from organic local growers and sustainable farms. Free delivery on orders over $50.00!
              </Typography>
            </Box>

            {/* Decorative organic pattern element */}
            <Box
              sx={{
                opacity: 0.1,
                fontSize: "120px",
                position: "absolute",
                right: -20,
                bottom: -30,
                userSelect: "none",
                pointerEvents: "none"
              }}
            >
              🥗
            </Box>
          </Paper>

          {/* Search Bar Block */}
          <Box id="search-bar-section">
            <SearchBar value={searchQuery} onChange={(q) => setSearchQuery(q)} />
          </Box>

          {/* Dynamic Filter and Sorting Controls */}
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => setSelectedCategory(cat)}
            selectedSort={selectedSort}
            onSortChange={(sort) => setSelectedSort(sort)}
          />

          {/* Error notice (redundant fallback visual if snackbar dismissed) */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              Unable to load products. Please check your network connection or try reloading.
            </Alert>
          )}

          {/* Product Cards Loading Grid or Empty State or Loaded Cards Grid */}
          {isLoading ? (
            <Grid container spacing={3} id="products-loading-skeleton-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2, bgcolor: "background.paper", borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                    <Skeleton variant="rectangular" width="100%" height={160} sx={{ borderRadius: 3 }} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="95%" height={20} />
                    <Skeleton variant="text" width="95%" height={20} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                      <Skeleton variant="text" width="25%" height={24} />
                      <Skeleton variant="rectangular" width="30%" height={32} sx={{ borderRadius: 2 }} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : products.length === 0 ? (
            // Elegant Empty state
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: 5,
                bgcolor: isDarkMode ? "rgba(24, 24, 27, 0.4)" : "#fafafa",
                border: "1px dashed",
                borderColor: "divider",
                textAlign: "center"
              }}
              id="products-empty-state-card"
            >
              <Box sx={{ display: "inline-flex", p: 2, bgcolor: "orange.50", color: "primary.main", borderRadius: "50%", mb: 2 }}>
                <SadIcon sx={{ fontSize: 48, color: "#f97316" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "extrabold", color: "text.primary", mb: 1 }}>
                No products found.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxW: 400, mx: "auto", mb: 3 }}>
                We couldn't find any products matching your search query or selected category. Let's try resetting the filters!
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetFilters}
                startIcon={<RefreshIcon />}
                sx={{ borderRadius: 3, fontWeight: "bold" }}
              >
                Reset All Filters
              </Button>
            </Paper>
          ) : (
            // Responsive Product Grid: 4 cards on desktop, 2 cards on tablet, 1 card on mobile
            <Grid container spacing={3} id="products-loaded-grid">
              {products.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                  <ProductCard
                    product={product}
                    onViewDetails={(id) => navigate(`product/${id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          )}

        </Stack>

        {/* Global Snackbar notification for fetching failure */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            Unable to load products.
          </Alert>
        </Snackbar>

      </Container>
    </MuiThemeProvider>
  );
};
