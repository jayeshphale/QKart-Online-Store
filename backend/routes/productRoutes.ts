/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { getProducts, searchProducts, getProductById } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

export default router;
