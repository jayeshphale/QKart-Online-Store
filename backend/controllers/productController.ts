/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { getDatabase } from "../services/dbService";

export const getProducts = (req: Request, res: Response) => {
  const db = getDatabase();
  let result = [...db.products];

  const q = req.query.q as string;
  const category = req.query.category as string;
  const sort = req.query.sort as string; // 'price_asc' | 'price_desc' | 'rating_desc'

  // 1. Search Query
  if (q) {
    const query = q.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  // 2. Category Filter
  if (category && category !== "All") {
    const catLower = category.toLowerCase();
    if (catLower === "mobiles" || catLower === "smartphones") {
      result = result.filter((p) => {
        const cat = p.category.toLowerCase();
        return (
          cat === "smartphones" ||
          cat === "mobiles" ||
          cat.endsWith("> smartphones") ||
          cat.includes("smartphone")
        ) && !cat.includes("accessories");
      });
    } else if (catLower === "electronics") {
      result = result.filter((p) => {
        const cat = p.category.toLowerCase();
        return (
          cat === "smartphones" ||
          cat === "mobiles" ||
          cat.endsWith("> smartphones") ||
          cat.includes("smartphone") ||
          cat === "laptops" ||
          cat.endsWith("> laptops") ||
          cat.includes("laptop") ||
          cat === "tablets" ||
          cat.endsWith("> tablets") ||
          cat.includes("tablet")
        ) && !cat.includes("accessories");
      });
    } else if (catLower === "fashion") {
      result = result.filter((p) => [
        "mens shirts", "mens shoes", "mens watches", "mens clothing",
        "womens bags", "womens dresses", "womens jewellery", "womens shoes", "womens watches", "womens clothing", "tops", "sunglasses",
        "baby clothing", "boys clothing", "girls clothing", "kids shoes", "kids wear"
      ].includes(p.category.toLowerCase()));
    } else if (catLower === "home appliances") {
      result = result.filter((p) => ["home decoration", "kitchen accessories", "furniture"].includes(p.category.toLowerCase()));
    } else if (catLower === "kitchen") {
      result = result.filter((p) => ["kitchen accessories", "groceries"].includes(p.category.toLowerCase()));
    } else if (catLower === "beauty") {
      result = result.filter((p) => ["beauty", "skin care", "fragrances"].includes(p.category.toLowerCase()));
    } else if (catLower === "automotive") {
      result = result.filter((p) => ["motorcycle", "vehicle"].includes(p.category.toLowerCase()));
    } else if (catLower === "sports") {
      result = result.filter((p) => p.category.toLowerCase().includes("sport"));
    } else if (catLower === "gaming") {
      result = result.filter((p) => 
        p.category.toLowerCase() === "laptops" || 
        p.name.toLowerCase().includes("game") || 
        p.description.toLowerCase().includes("game")
      );
    } else if (catLower === "books") {
      result = result.filter((p) => 
        p.category.toLowerCase() === "books" || 
        p.name.toLowerCase().includes("book") || 
        p.description.toLowerCase().includes("book")
      );
    } else if (catLower === "toys") {
      result = result.filter((p) => 
        p.category.toLowerCase() === "toys" || 
        p.name.toLowerCase().includes("toy") || 
        p.description.toLowerCase().includes("toy")
      );
    } else {
      result = result.filter((p) => p.category.toLowerCase() === catLower);
    }
  }

  // 3. Sorting
  if (sort) {
    if (sort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating_desc") {
      result.sort((a, b) => b.rating - a.rating);
    }
  }

  return res.json(result);
};

export const searchProducts = (req: Request, res: Response) => {
  const q = req.query.q as string;
  const db = getDatabase();
  if (!q) {
    return res.json(db.products);
  }
  const query = q.toLowerCase().trim();
  const result = db.products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  );
  return res.json(result);
};

export const getProductById = (req: Request, res: Response) => {
  const id = req.params.id;
  const db = getDatabase();
  const product = db.products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
};
