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
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton
} from "@mui/material";
import { 
  ShoppingCart as ShoppingCartIcon, 
  FlashOn as BuyIcon, 
  Visibility as QuickViewIcon,
  Close as CloseIcon 
} from "@mui/icons-material";
import { Heart, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { showNotification } = useNotification();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  React.useEffect(() => {
    setImgSrc(product.image);
  }, [product.image]);

  const isOutOfStock = product.stock <= 0;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification("Please login first to add items to your cart.", "warning");
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

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification("Please login first to purchase.", "warning");
      window.location.hash = "#/login";
      return;
    }
    setIsBuying(true);
    const res = await addToCart(product, 1);
    setIsBuying(false);

    if (res.success) {
      window.location.hash = "#/checkout";
    } else {
      showNotification(res.message, "warning");
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
      showNotification("Removed item from wishlist", "info");
    } else {
      addToWishlist(product);
      showNotification("Added item to wishlist!", "success");
    }
  };

  const handleQuickViewOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleQuickViewClose = (e: React.MouseEvent | React.SyntheticEvent) => {
    e.stopPropagation();
    setQuickViewOpen(false);
  };

  return (
    <>
      <Card
        id={`product-card-${product.id}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          position: "relative",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)",
            borderColor: "amber.500",
            "& .quick-view-overlay": {
              opacity: 1
            },
            "& .product-card-title": {
              color: "amber.600"
            }
          }
        }}
        onClick={() => onViewDetails(product.id)}
      >
        <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "#fafafa" }}>
          {/* Product Image */}
          <CardMedia
            component="img"
            image={imgSrc}
            alt={product.name}
            sx={{
              width: "100%",
              height: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              p: 0,
              transition: "transform 0.5s ease",
              "&:hover": {
                transform: "scale(1.05)"
              }
            }}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => {
              setImgSrc("https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80");
            }}
          />

          {/* Quick View Hover Overlay Button */}
          <Box
            className="quick-view-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.25s ease",
              zIndex: 5
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleQuickViewOpen}
              startIcon={<QuickViewIcon />}
              sx={{
                bgcolor: "white",
                color: "zinc.900",
                fontWeight: "bold",
                borderRadius: "20px",
                px: 2.5,
                py: 1,
                fontSize: "11px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "zinc.100",
                  transform: "scale(1.05)"
                }
              }}
            >
              Quick View
            </Button>
          </Box>

          {/* Brand Badge Overlay */}
          <Chip
            label={product.brand}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              fontWeight: "bold",
              fontSize: "9px",
              textTransform: "uppercase",
              bgcolor: "zinc.900",
              color: "white",
              zIndex: 10,
              boxShadow: "0 2px 4px rgba(0,0,0,0.12)"
            }}
          />

          {/* Wishlist Heart Icon Button Overlay */}
          <button
            onClick={handleWishlistToggle}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              cursor: "pointer",
              outline: "none",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            id={`wishlist-toggle-${product.id}`}
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${
                wishlisted ? "fill-red-500 text-red-500" : "text-zinc-400 hover:text-red-500"
              }`}
            />
          </button>

          {/* Discount Tag Overlay */}
          {product.discount > 0 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                bgcolor: "error.main",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: "900",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                zIndex: 10
              }}
            >
              {product.discount}% OFF
            </Box>
          )}
        </Box>

        {/* Body Content */}
        <CardContent sx={{ flexGrow: 1, p: 2, pb: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
          
          {/* Category Label */}
          <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: "bold", color: "amber.600", letterSpacing: 0.5, fontSize: "10px" }}>
            {product.category}
          </Typography>

          {/* Product Title */}
          <Typography
            variant="h6"
            component="h3"
            className="product-card-title"
            sx={{
              fontWeight: 700,
              fontSize: "0.925rem",
              lineHeight: 1.3,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              height: "2.4rem",
              transition: "color 0.2s ease-in-out"
            }}
          >
            {product.name}
          </Typography>

          {/* Rating component & Reviews Count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
            <Rating
              name={`rating-${product.id}`}
              value={product.rating}
              precision={0.1}
              readOnly
              size="small"
              emptyIcon={<Star style={{ opacity: 0.25 }} fontSize="inherit" />}
            />
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "text.primary", fontSize: "11px" }}>
              {product.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "10px" }}>
              ({product.reviewsCount.toLocaleString()})
            </Typography>
          </Box>

          {/* Pricing Layout */}
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: "text.primary", fontSize: "1.25rem" }}>
              ${product.price.toFixed(2)}
            </Typography>
            {product.discount > 0 && (
              <Typography variant="body2" sx={{ color: "text.secondary", textDecoration: "line-through", fontSize: "0.85rem" }}>
                ${product.originalPrice.toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* Free Delivery Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <Typography variant="caption" sx={{ color: "emerald.600", fontWeight: "700", fontSize: "10.5px" }}>
              Free Delivery
            </Typography>
          </Box>

          {/* Stock Status indicator */}
          <Box sx={{ mt: 0.5 }}>
            <Chip
              label={isOutOfStock ? "Out of Stock" : `Only ${product.stock} left in stock`}
              size="small"
              color={isOutOfStock ? "error" : "warning"}
              variant="outlined"
              sx={{
                fontSize: "9px",
                fontWeight: "bold",
                height: 18,
                borderColor: isOutOfStock ? "error.light" : "amber.300",
                bgcolor: isOutOfStock ? "transparent" : "amber.50/20"
              }}
            />
          </Box>
        </CardContent>

        {/* Footer CTA Actions (Add to Cart & Buy Now) */}
        <CardActions
          sx={{
            p: 2,
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 1
          }}
        >
          <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
            {/* Add to Cart Button */}
            <Button
              variant="outlined"
              size="small"
              fullWidth
              disabled={isAdding || isOutOfStock}
              onClick={handleAddToCart}
              id={`add-to-cart-btn-${product.id}`}
              startIcon={isAdding ? <CircularProgress size={12} color="inherit" /> : <ShoppingCartIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "11px",
                textTransform: "none",
                py: 1,
                borderColor: "amber.500",
                color: "amber.700",
                "&:hover": {
                  borderColor: "amber.600",
                  bgcolor: "amber.50/20"
                }
              }}
            >
              Add to Cart
            </Button>

            {/* Buy Now Button */}
            <Button
              variant="contained"
              size="small"
              fullWidth
              disabled={isBuying || isOutOfStock}
              onClick={handleBuyNow}
              id={`buy-now-btn-${product.id}`}
              startIcon={isBuying ? <CircularProgress size={12} color="inherit" /> : <BuyIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "11px",
                textTransform: "none",
                py: 1,
                boxShadow: "none",
                background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 100%)",
                color: "zinc.900",
                border: "1px solid",
                borderColor: "#d97706",
                "&:hover": {
                  background: "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)",
                  boxShadow: "none"
                }
              }}
            >
              Buy Now
            </Button>
          </Box>
        </CardActions>
      </Card>

      {/* Quick View Popup Modal */}
      <Dialog
        open={quickViewOpen}
        onClose={handleQuickViewClose}
        onClick={(e) => e.stopPropagation()}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.2)"
          }
        }}
      >
        <Box sx={{ position: "relative", p: 4, bgcolor: "background.paper" }}>
          {/* Close button */}
          <IconButton
            onClick={handleQuickViewClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "text.secondary",
              bgcolor: "zinc.100",
              "&:hover": {
                bgcolor: "zinc.200"
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mt: 1 }}>
            {/* Image Col */}
            <Box sx={{ width: { xs: "100%", md: "45%" }, borderRadius: "16px", overflow: "hidden", border: "1px solid", borderColor: "divider", bgcolor: "zinc.50", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={imgSrc}
                alt={product.name}
                style={{ width: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover" }}
                referrerPolicy="no-referrer"
                onError={() => setImgSrc("https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80")}
              />
            </Box>

            {/* Info Col */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Chip label={product.brand} size="small" sx={{ fontWeight: "bold", bgcolor: "zinc.900", color: "white", textTransform: "uppercase", mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, tracking: "tight", mb: 1, color: "text.primary" }}>
                  {product.name}
                </Typography>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: "bold", color: "amber-600", tracking: 0.5 }}>
                  {product.category}
                </Typography>
              </Box>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating value={product.rating} readOnly precision={0.1} size="small" />
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{product.rating.toFixed(1)}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>({product.reviewsCount.toLocaleString()} Customer Reviews)</Typography>
              </Box>

              <hr style={{ border: "0", borderTop: "1px solid", borderColor: "var(--color-zinc-200)" }} />

              {/* Price */}
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
                  ${product.price.toFixed(2)}
                </Typography>
                {product.discount > 0 && (
                  <>
                    <Typography variant="body1" sx={{ color: "text.secondary", textDecoration: "line-through" }}>
                      ${product.originalPrice.toFixed(2)}
                    </Typography>
                    <Chip label={`${product.discount}% OFF`} size="small" color="error" sx={{ fontWeight: "900", borderRadius: 1 }} />
                  </>
                )}
              </Box>

              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                Discover high performance and extreme premium craftsmanship in this {product.category.toLowerCase()} item by {product.brand}. Designed for users who demand excellence, durability, and a clean, responsive daily experience.
              </Typography>

              {/* Highlights */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, bgcolor: "zinc.50", dark: { bgcolor: "zinc.900" }, p: 2, borderRadius: "12px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <Typography variant="caption" sx={{ color: "zinc.700", fontWeight: "bold" }}>
                    {product.deliveryInfo} &middot; Eligible for Free Delivery
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <Typography variant="caption" sx={{ color: "zinc.700", fontWeight: "bold" }}>
                    QKart Assured Brand Partner &middot; 100% Genuine product
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <Typography variant="caption" sx={{ color: "zinc.700", fontWeight: "bold" }}>
                    Easy 10-day return policy
                  </Typography>
                </Box>
              </Box>

              {/* Stock info */}
              <Typography variant="body2" sx={{ fontWeight: "bold", color: isOutOfStock ? "error.main" : "amber.700" }}>
                {isOutOfStock ? "Out of Stock" : `In Stock: Only ${product.stock} units left!`}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: "12px",
                    borderColor: "amber.500",
                    color: "amber.700",
                    fontWeight: "bold",
                    "&:hover": {
                      borderColor: "amber.600",
                      bgcolor: "amber.50/10"
                    }
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  startIcon={<BuyIcon />}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: "12px",
                    fontWeight: "bold",
                    boxShadow: "none",
                    background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 100%)",
                    color: "zinc.900",
                    border: "1px solid",
                    borderColor: "#d97706",
                    "&:hover": {
                      background: "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)",
                      boxShadow: "none"
                    }
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
