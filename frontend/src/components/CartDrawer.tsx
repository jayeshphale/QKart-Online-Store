/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { AnimatePresence, motion } from "motion/react";

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const { cartItems, cartCount, cartTotal, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const handleQtyChange = async (productId: string, currentQty: number, change: number) => {
    const target = currentQty + change;
    if (target <= 0) {
      const res = await removeFromCart(productId);
      if (res.success) {
        showNotification("Item removed from cart", "info");
      }
    } else {
      await updateQuantity(productId, target);
    }
  };

  const handleRemove = async (productId: string) => {
    const res = await removeFromCart(productId);
    if (res.success) {
      showNotification("Item removed from cart", "info");
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      showNotification("Please login to proceed to checkout", "warning");
      navigate("login");
    } else {
      navigate("checkout");
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs cursor-pointer"
            id="cart-drawer-backdrop"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-colors duration-200"
            id="cart-drawer-panel"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <h2 className="text-md font-extrabold text-zinc-800 dark:text-zinc-100">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 transition-colors cursor-pointer"
                id="cart-drawer-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center select-none" id="empty-cart-view">
                  <div className="bg-orange-50 dark:bg-orange-950/20 text-orange-500 p-4 rounded-full mb-4">
                    <ShoppingBag className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm mb-1" id="empty-cart-message">
                    Your cart is empty.
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-[220px]">
                    Fill it with organic bananas, milk, snacks, and smart gadgets!
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("products");
                    }}
                    className="mt-4 px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all cursor-pointer"
                    id="empty-cart-continue-btn"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900/40 relative group"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 bg-white border border-zinc-200/50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400 block mb-1">
                          {item.product.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 shadow-xs">
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.quantity, -1)}
                            className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.quantity, 1)}
                            className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-xs font-extrabold text-orange-600 dark:text-orange-400">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="absolute top-2 right-2 p-1 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold">FREE</span>
                  </div>
                  <hr className="border-zinc-200 dark:border-zinc-800/80 my-1" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">Total Price</span>
                    <span className="text-base font-extrabold text-orange-600 dark:text-orange-400">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all cursor-pointer"
                  id="cart-checkout-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
                
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  id="cart-continue-shopping-btn"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
