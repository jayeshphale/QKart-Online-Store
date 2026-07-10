/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from "./api";
import { CartItem } from "../types";

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get("/cart");
    return response.data;
  },

  addToCart: async (productId: string, quantity: number): Promise<CartItem[]> => {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
  },

  updateQuantity: async (productId: string, quantity: number): Promise<CartItem[]> => {
    const response = await api.put("/cart", { productId, quantity });
    return response.data;
  },

  removeFromCart: async (productId: string): Promise<CartItem[]> => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  }
};
