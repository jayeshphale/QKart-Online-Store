/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { addAddress, addWalletFunds, checkout, getOrders } from "../controllers/walletController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.post("/addresses", addAddress);
router.post("/wallet/add", addWalletFunds);
router.post("/checkout", checkout);
router.get("/orders", getOrders);

export default router;
