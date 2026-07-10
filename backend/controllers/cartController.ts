/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from "express";
import { getDatabase, saveDatabase } from "../services/dbService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const getCart = (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();
  const cart = db.carts[normalizedUsername] || [];
  return res.json(cart);
};

export const addToCart = (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();

  if (!productId || typeof quantity !== "number") {
    return res.status(400).json({ message: "productId and quantity are required" });
  }

  const product = db.products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let userCart = db.carts[normalizedUsername] || [];
  const existingIndex = userCart.findIndex((item) => item.product.id === productId);

  if (existingIndex > -1) {
    if (quantity <= 0) {
      userCart.splice(existingIndex, 1);
    } else {
      userCart[existingIndex].quantity = quantity;
    }
  } else {
    if (quantity > 0) {
      userCart.push({ product, quantity });
    }
  }

  db.carts[normalizedUsername] = userCart;
  saveDatabase(db);
  return res.json(userCart);
};

export const updateCartItem = (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();

  if (!productId || typeof quantity !== "number") {
    return res.status(400).json({ message: "productId and quantity are required" });
  }

  let userCart = db.carts[normalizedUsername] || [];
  const existingIndex = userCart.findIndex((item) => item.product.id === productId);

  if (existingIndex > -1) {
    if (quantity <= 0) {
      userCart.splice(existingIndex, 1);
    } else {
      userCart[existingIndex].quantity = quantity;
    }
  } else {
    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (quantity > 0) {
      userCart.push({ product, quantity });
    }
  }

  db.carts[normalizedUsername] = userCart;
  saveDatabase(db);
  return res.json(userCart);
};

export const removeCartItem = (req: AuthenticatedRequest, res: Response) => {
  const productId = req.params.id;
  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();

  let userCart = db.carts[normalizedUsername] || [];
  db.carts[normalizedUsername] = userCart.filter((item) => item.product.id !== productId);

  saveDatabase(db);
  return res.json(db.carts[normalizedUsername]);
};
