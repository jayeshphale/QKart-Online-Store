/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from "express";
import { getDatabase, saveDatabase } from "../services/dbService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Order } from "../types";

export const addAddress = (req: AuthenticatedRequest, res: Response) => {
  const { address } = req.body;
  if (!address || !address.trim()) {
    return res.status(400).json({ message: "Address is required" });
  }

  if (address.trim().length < 10) {
    return res.status(400).json({ message: "Address must contain at least 10 characters" });
  }

  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();
  const user = db.users[normalizedUsername];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.addresses.push(address.trim());
  saveDatabase(db);

  return res.json({ success: true, addresses: user.addresses });
};

export const editAddress = (req: AuthenticatedRequest, res: Response) => {
  const { index } = req.params;
  const { address } = req.body;
  const addrIdx = parseInt(index, 10);

  if (isNaN(addrIdx) || !address || !address.trim()) {
    return res.status(400).json({ message: "Valid address and index are required" });
  }

  if (address.trim().length < 10) {
    return res.status(400).json({ message: "Address must contain at least 10 characters" });
  }

  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();
  const user = db.users[normalizedUsername];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (addrIdx < 0 || addrIdx >= user.addresses.length) {
    return res.status(400).json({ message: "Invalid address index" });
  }

  user.addresses[addrIdx] = address.trim();
  saveDatabase(db);

  return res.json({ success: true, addresses: user.addresses });
};

export const deleteAddress = (req: AuthenticatedRequest, res: Response) => {
  const { index } = req.params;
  const addrIdx = parseInt(index, 10);

  if (isNaN(addrIdx)) {
    return res.status(400).json({ message: "Valid address index is required" });
  }

  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();
  const user = db.users[normalizedUsername];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (addrIdx < 0 || addrIdx >= user.addresses.length) {
    return res.status(400).json({ message: "Invalid address index" });
  }

  user.addresses.splice(addrIdx, 1);
  saveDatabase(db);

  return res.json({ success: true, addresses: user.addresses });
};

export const addWalletFunds = (req: AuthenticatedRequest, res: Response) => {
  const { amount } = req.body;
  const addAmt = parseFloat(amount);
  if (isNaN(addAmt) || addAmt <= 0) {
    return res.status(400).json({ message: "Invalid amount to add" });
  }

  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();
  const user = db.users[normalizedUsername];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.walletBalance += addAmt;
  saveDatabase(db);

  return res.json({ success: true, walletBalance: user.walletBalance });
};

export const checkout = (req: AuthenticatedRequest, res: Response) => {
  const { address, couponCode } = req.body;
  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();
  const user = db.users[normalizedUsername];
  const userCart = db.carts[normalizedUsername] || [];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (userCart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  if (!address) {
    return res.status(400).json({ message: "Delivery address is required" });
  }

  // Calculate base price
  let basePrice = userCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let totalPrice = basePrice;
  let discountAmount = 0;

  // Apply Coupon if exists
  if (couponCode) {
    const coupons = (db as any).coupons || [];
    const coupon = coupons.find((c: any) => c.code.trim().toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon) {
      if (!coupon.minCartValue || basePrice >= coupon.minCartValue) {
        discountAmount = coupon.discountAmount || 0;
        if (coupon.discountPercentage) {
          discountAmount = (basePrice * coupon.discountPercentage) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        }
        totalPrice = Math.max(0, basePrice - discountAmount);
      }
    }
  }

  // Check balance
  if (user.walletBalance < totalPrice) {
    return res.status(400).json({
      message: `Insufficient balance. Wallet has $${user.walletBalance.toFixed(2)}, but order total is $${totalPrice.toFixed(2)}. Add more funds or adjust your cart.`
    });
  }

  // Deduct balance
  user.walletBalance -= totalPrice;

  // Create Order
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const dateObj = new Date();
  const deliveryDateObj = new Date();
  deliveryDateObj.setDate(dateObj.getDate() + 3); // 3 days expected delivery

  const newOrder: Order = {
    id: orderId,
    items: [...userCart],
    totalPrice,
    address,
    date: dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    deliveryDate: deliveryDateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    walletBalanceRemaining: user.walletBalance
  };

  // Save Order History
  const userOrders = db.orders[normalizedUsername] || [];
  userOrders.unshift(newOrder); // Add to the top of history
  db.orders[normalizedUsername] = userOrders;

  // Clear Cart
  db.carts[normalizedUsername] = [];

  saveDatabase(db);

  return res.json({
    success: true,
    message: "Order placed successfully!",
    order: newOrder
  });
};

export const getOrders = (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const normalizedUsername = username.toLowerCase();
  const orders = db.orders[normalizedUsername] || [];
  return res.json(orders);
};
