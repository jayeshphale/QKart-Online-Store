/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CartItem } from "../types";

interface OrderSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  discountAmount?: number;
  couponCode?: string | null;
  onRemoveCoupon?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cartItems, 
  cartTotal,
  discountAmount = 0,
  couponCode = null,
  onRemoveCoupon
}) => {
  const totalItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const finalPayable = Math.max(0, cartTotal - discountAmount);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4 sticky top-24" id="order-summary-box">
      <h3 className="font-extrabold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
        Order Summary
      </h3>

      {/* Cart Items List */}
      <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1" id="checkout-cart-items-list">
        {cartItems.map((item) => {
          const itemTotal = item.product.price * item.quantity;
          return (
            <div key={item.product.id} className="flex gap-3.5 items-center justify-between" id={`summary-item-${item.product.id}`}>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-xl shrink-0 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-zinc-700 dark:text-zinc-200 line-clamp-1">
                    {item.product.name}
                  </h4>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold mt-0.5">
                    Qty: {item.quantity} &middot; ${item.product.price.toFixed(2)} each
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-zinc-800 dark:text-zinc-100 shrink-0">
                ${itemTotal.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800/80 my-1" />

      {/* Price Calculations */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
          <span>Total Items</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300" id="total-items-count">{totalItemsCount} items</span>
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
          <span>Delivery</span>
          <span className="text-emerald-500 font-black">FREE</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl">
            <span className="flex items-center gap-1">
              <span>Coupon Promo ({couponCode})</span>
              {onRemoveCoupon && (
                <button 
                  onClick={onRemoveCoupon}
                  type="button"
                  className="text-rose-500 hover:text-rose-600 font-black cursor-pointer text-[10px] uppercase border-l border-emerald-500/30 pl-2 ml-1"
                >
                  Remove
                </button>
              )}
            </span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <hr className="border-zinc-150 dark:border-zinc-800/80 my-0.5" />
        
        <div className="flex items-center justify-between text-sm" id="summary-grand-total">
          <span className="font-black text-zinc-800 dark:text-zinc-200">Order Total</span>
          <span className="text-base font-black text-orange-600 dark:text-orange-400" id="order-total-amount">
            ${finalPayable.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
