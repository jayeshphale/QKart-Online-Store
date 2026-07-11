/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import { getProducts, searchProducts, getProductById } from "../controllers/productController";
import { 
  getCategories, 
  getSubcategories, 
  getBestSellers, 
  getNewArrivals, 
  getTodayDeals, 
  getTopRated, 
  getRecommended, 
  getFeatured, 
  getTrending 
} from "../controllers/enterpriseController";

const router = Router();

router.get("/", getProducts);
router.get("/search", searchProducts);

// Static custom sub-routes (MUST be before /:id)
router.get("/categories", getCategories);
router.get("/subcategories", getSubcategories);
router.get("/best-sellers", getBestSellers);
router.get("/new-arrivals", getNewArrivals);
router.get("/today-deals", getTodayDeals);
router.get("/top-rated", getTopRated);
router.get("/recommended", getRecommended);
router.get("/featured", getFeatured);
router.get("/trending", getTrending);

router.get("/:id", getProductById);

export default router;
