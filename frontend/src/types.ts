/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  stock: number;
  brand: string;
  originalPrice: number;
  discount: number;
  reviewsCount: number;
  images: string[];
  specifications: Record<string, string>;
  deliveryInfo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  username: string;
  walletBalance: number;
  addresses: string[];
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  address: string;
  date: string;
  deliveryDate: string;
  walletBalanceRemaining: number;
}
