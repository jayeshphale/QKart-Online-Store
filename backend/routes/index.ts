/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import cartRoutes from "./cartRoutes";
import { addAddress, editAddress, deleteAddress, addWalletFunds, checkout, getOrders } from "../controllers/walletController";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getSearchSuggestions,
  getSearchHistory,
  getRecentlyViewed,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAddresses,
  createAddressSimulated,
  updateAddressSimulated,
  deleteAddressSimulated,
  getOrderDetails,
  cancelOrder,
  returnOrder,
  trackOrder,
  getProductReviews,
  createProductReview,
  getCoupons,
  applyCoupon,
  getNotifications,
  getPrimeBenefits,
  getSellerProfile,
  getSellerProductsList
} from "../controllers/enterpriseController";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);

// --- ENTERPRISE AMAZON INDIA API SIMULATION ENDPOINTS ---

// Auth Recovery & Profile Details
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/verify-otp", verifyOtp);
router.post("/auth/reset-password", resetPassword);
router.get("/auth/profile", authenticateToken, getUserProfile);
router.put("/auth/profile", authenticateToken, updateUserProfile);

// Wishlist
router.get("/wishlist", authenticateToken, getWishlist);
router.post("/wishlist", authenticateToken, addToWishlist);
router.delete("/wishlist/:id", authenticateToken, removeFromWishlist);

// Dynamic / Search Autocomplete suggestions
router.get("/search/suggestions", getSearchSuggestions);
router.get("/search/history", authenticateToken, getSearchHistory);
router.get("/recently-viewed", authenticateToken, getRecentlyViewed);

// Core Address Management
router.get("/addresses", authenticateToken, getAddresses);
router.post("/addresses", authenticateToken, createAddressSimulated);
router.put("/addresses/:id", authenticateToken, updateAddressSimulated);
router.delete("/addresses/:id", authenticateToken, deleteAddressSimulated);

// Orders Cancel/Return/Track details
router.get("/orders/:id", authenticateToken, getOrderDetails);
router.post("/orders/cancel-order", authenticateToken, cancelOrder);
router.post("/orders/return-order", authenticateToken, returnOrder);
router.post("/orders/track-order", authenticateToken, trackOrder);

// Reviews
router.get("/reviews", getProductReviews);
router.post("/review", authenticateToken, createProductReview);

// Coupons, Notifications, Prime, Sellers
router.get("/coupons", getCoupons);
router.post("/apply-coupon", applyCoupon);
router.get("/notifications", authenticateToken, getNotifications);
router.get("/prime-benefits", authenticateToken, getPrimeBenefits);
router.get("/seller/profile", getSellerProfile);
router.get("/seller/products", getSellerProductsList);

// --- LEGACY ENDPOINTS (FOR MAXIMUM BACKWARDS COMPATIBILITY) ---
router.put("/addresses/legacy/:index", authenticateToken, editAddress);
router.delete("/addresses/legacy/:index", authenticateToken, deleteAddress);
router.post("/checkout", authenticateToken, checkout);
router.get("/orders", authenticateToken, getOrders);
router.post("/wallet/add", authenticateToken, addWalletFunds);

export default router;
