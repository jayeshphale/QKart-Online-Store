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

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);

// Mount other /api/v1 endpoints matching the original API surface area
router.post("/addresses", authenticateToken, addAddress);
router.put("/addresses/:index", authenticateToken, editAddress);
router.delete("/addresses/:index", authenticateToken, deleteAddress);
router.post("/checkout", authenticateToken, checkout);
router.get("/orders", authenticateToken, getOrders);
router.post("/wallet/add", authenticateToken, addWalletFunds);

export default router;
