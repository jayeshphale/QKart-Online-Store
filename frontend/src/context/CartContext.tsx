/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import { CartItem, Product } from "../types";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cartService";
import { api } from "../services/api";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (productId: string) => Promise<{ success: boolean; message: string }>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { isAuthenticated, token } = useAuth();

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Load wishlist from backend if authenticated, otherwise fallback to localStorage
  useEffect(() => {
    const loadInitialWishlist = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/wishlist");
          const resData = response.data;
          
          let rawList: any[] = [];
          if (Array.isArray(resData)) {
            rawList = resData;
          } else if (resData && resData.success && Array.isArray(resData.data)) {
            rawList = resData.data;
          } else if (resData && Array.isArray(resData.products)) {
            rawList = resData.products;
          }

          // Map items to Product[]
          const products: Product[] = rawList.map((item: any) => {
            if (!item) return null;
            if (item.productDetails) return item.productDetails;
            if (item.product) return item.product;
            if (item.id && item.name && item.price) return item; // already a product
            return null;
          }).filter((p: any): p is Product => p !== null);

          setWishlistItems(products);
          return;
        } catch (err) {
          console.error("Failed to fetch wishlist from server:", err);
        }
      }
      
      // Fallback
      try {
        const stored = localStorage.getItem("wishlist");
        setWishlistItems(stored ? JSON.parse(stored) : []);
      } catch {
        setWishlistItems([]);
      }
    };
    loadInitialWishlist();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  const addToWishlist = async (product: Product) => {
    if (wishlistItems.some((item) => item.id === product.id)) {
      return;
    }
    
    // Optimistic update
    setWishlistItems((prev) => [...prev, product]);

    if (isAuthenticated) {
      try {
        await api.post("/wishlist", { productId: product.id });
      } catch (err) {
        console.error("Failed to add to server wishlist:", err);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    // Optimistic update
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

    if (isAuthenticated) {
      try {
        await api.delete(`/wishlist/${productId}`);
      } catch (err) {
        console.error("Failed to remove from server wishlist:", err);
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Compute total count and total cost
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Load cart when user logs in or is authenticated
  const fetchCart = async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await cartService.getCart();
      setCartItems(data);
      localStorage.setItem("cart", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger loading cart on authentication change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  }, [isAuthenticated, token]);

  const addToCart = async (product: Product, quantity: number = 1): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !token) {
      return { success: false, message: "Please login first." };
    }

    setIsLoading(true);
    try {
      const existing = cartItems.find((item) => item.product.id === product.id);
      const targetQty = (existing?.quantity || 0) + quantity;

      const data = await cartService.addToCart(product.id, targetQty);

      setCartItems(data);
      localStorage.setItem("cart", JSON.stringify(data));
      
      // Auto-open cart drawer for immediate visual feedback
      setIsCartOpen(true);
      
      return { success: true, message: "Item added to cart." };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update cart";
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !token) {
      return { success: false, message: "Please login first." };
    }

    setIsLoading(true);
    try {
      const data = await cartService.updateQuantity(productId, quantity);

      setCartItems(data);
      localStorage.setItem("cart", JSON.stringify(data));
      return { success: true, message: "Cart updated successfully!" };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update quantity";
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated || !token) {
      return { success: false, message: "Please login first." };
    }

    setIsLoading(true);
    try {
      const data = await cartService.removeFromCart(productId);

      setCartItems(data);
      localStorage.setItem("cart", JSON.stringify(data));
      return { success: true, message: "Item removed from cart" };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to remove item";
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
