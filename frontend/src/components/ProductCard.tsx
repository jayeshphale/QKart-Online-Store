/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  CircularProgress
} from "@mui/material";
import { AddShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card navigation click
    if (!isAuthenticated) {
      showNotification("Please login first.", "warning");
      window.location.hash = "#/login";
      return;
    }
    setIsAdding(true);
    const res = await addToCart(product, 1);
    setIsAdding(false);

    if (res.success) {
      showNotification(res.message, "success");
    } else {
      showNotification(res.message, "warning");
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Card
      id={`product-card-${product.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
          "& .product-card-title": {
            color: "primary.main"
          }
        }
      }}
      onClick={() => onViewDetails(product.id)}
    >
      <Box sx={{ position: "relative" }}>
        {/* Product Image */}
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            aspectRatio: "16/10",
            objectFit: "cover",
            backgroundColor: "background.default"
          }}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Category Badge overlay */}
        <Chip
          label={product.category}
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
            fontSize: "10px",
            textTransform: "uppercase",
            bgcolor: "rgba(249, 115, 22, 0.9)", // QKart standard orange with slight opacity
            color: "white",
            backdropFilter: "blur(4px)"
          }}
        />
      </Box>

      {/* Body Content */}
      <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        
        {/* Rating component */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Rating
            name={`rating-${product.id}`}
            value={product.rating}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.secondary" }}>
            {product.rating.toFixed(1)}
          </Typography>
        </Box>

        {/* Product Title (clickable) */}
        <Typography
          variant="h6"
          component="h3"
          className="product-card-title"
          sx={{
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1.3,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            transition: "color 0.2s ease-in-out"
          }}
        >
          {product.name}
        </Typography>

        {/* Short Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.775rem",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            height: "2.8rem" // ensures uniform sizing
          }}
        >
          {product.description}
        </Typography>

        {/* Stock Status */}
        <Box sx={{ mt: "auto", pt: 1 }}>
          <Chip
            label={isOutOfStock ? "Out of Stock" : `In Stock: ${product.stock} units`}
            size="small"
            color={isOutOfStock ? "error" : "success"}
            variant="outlined"
            sx={{
              fontSize: "10px",
              fontWeight: "bold",
              height: 20
            }}
          />
        </Box>
      </CardContent>

      {/* Footer Info & CTA Button */}
      <CardActions
        sx={{
          p: 2.5,
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "9px", fontWeight: "bold", textTransform: "uppercase" }}>
            Price
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "text.primary" }}>
            ${product.price.toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          disabled={isAdding || isOutOfStock}
          onClick={handleAddToCart}
          id={`add-to-cart-btn-${product.id}`}
          startIcon={isAdding ? <CircularProgress size={16} color="inherit" /> : <ShoppingCartIcon />}
          sx={{
            borderRadius: 2.5,
            fontWeight: "bold",
            px: 2,
            py: 0.75,
            textTransform: "none",
            background: "linear-gradient(90deg, #f97316 0%, #f59e0b 100%)",
            color: "white",
            "&:hover": {
              background: "linear-gradient(90deg, #ea580c 0%, #d97706 100%)",
            }
          }}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
};
