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
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
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
