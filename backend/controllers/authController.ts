/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getDatabase, saveDatabase } from "../services/dbService";
import { JWT_SECRET } from "../config/config";

export const register = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  const db = getDatabase();
  const normalizedUsername = username.trim().toLowerCase();

  // Check if user already exists
  if (db.users[normalizedUsername]) {
    return res.status(400).json({ message: "Username already exists. Please choose another." });
  }

  // Hash representation using simple base64
  const passwordHash = Buffer.from(password).toString("base64");
  
  db.users[normalizedUsername] = {
    username: username.trim(),
    passwordHash,
    walletBalance: 5000.00, // Starts with $5000 mockup money
    addresses: ["123 Tech Avenue, Silicon Valley", "456 Innovation Boulevard, Bangalore"]
  };

  // Initialize empty cart, orders
  db.carts[normalizedUsername] = [];
  db.orders[normalizedUsername] = [];

  saveDatabase(db);
  return res.json({ success: true, message: "Registered Successfully" });
};

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const db = getDatabase();
  const normalizedUsername = username.trim().toLowerCase();
  const user = db.users[normalizedUsername];

  if (!user) {
    return res.status(400).json({ message: "Username does not exist" });
  }

  const expectedHash = Buffer.from(password).toString("base64");
  if (user.passwordHash !== expectedHash) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  // Sign Token
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "72h" });

  return res.json({
    success: true,
    token,
    username: user.username,
    walletBalance: user.walletBalance,
    addresses: user.addresses
  });
};
