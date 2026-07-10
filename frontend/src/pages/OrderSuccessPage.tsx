/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { CheckCircle2, Calendar, MapPin, Sparkles, Receipt, Wallet, ArrowRight } from "lucide-react";
import { Order } from "../types";
import { useAuth } from "../context/AuthContext";

interface OrderSuccessPageProps {
  navigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Read the last order details from sessionStorage
    const stored = sessionStorage.getItem("last_order");
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored order:", e);
      }
    }
  }, []);

  // Compute generic dates in case sessionStorage is cleared
  const getFallbackDeliveryDate = () => {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    return delivery.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn" id="order-success-page-container">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden transition-all duration-300">
        
        {/* Decorative sparkles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        {/* Dynamic Success Checkmark with Pulse */}
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-950/20 rounded-full scale-125 animate-ping opacity-75" />
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 text-white p-4.5 rounded-full shadow-lg relative z-10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>

        {/* Text Headers */}
        <div className="text-center flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full w-fit self-center uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Success Payment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
            Thank you for shopping at QKart Supermarket. Your items have been packed and are currently on their way to your delivery coordinates.
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-900 flex flex-col gap-4 text-xs">
          
          <div className="flex items-center justify-between font-bold text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Receipt ID</span>
            </div>
            <span className="text-zinc-800 dark:text-zinc-100">
              {order ? order.id : "ORD-" + Math.floor(100000 + Math.random() * 900000)}
            </span>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-900" />

          {/* Order Date block */}
          <div className="flex gap-3" id="order-success-date-block">
            <Calendar className="w-4.5 h-4.5 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-semibold">ORDER DATE</span>
              <p className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100 mt-0.5">
                {order ? order.date : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Delivery Date block */}
          <div className="flex gap-3" id="order-success-delivery-block">
            <Calendar className="w-4.5 h-4.5 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-semibold">EXPECTED DELIVERY TIMELINE</span>
              <p className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100 mt-0.5">
                {order ? order.deliveryDate : getFallbackDeliveryDate()} (Super Fast 3-Day)
              </p>
            </div>
          </div>

          {/* Wallet Balance block */}
          <div className="flex gap-3" id="order-success-wallet-block">
            <Wallet className="w-4.5 h-4.5 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-semibold">REMAINING WALLET BALANCE</span>
              <p className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100 mt-0.5">
                ${order ? order.walletBalanceRemaining.toFixed(2) : user ? user.walletBalance.toFixed(2) : "5000.00"}
              </p>
            </div>
          </div>

          {/* Location Delivery block */}
          {order && (
            <div className="flex gap-3" id="order-success-address-block">
              <MapPin className="w-4.5 h-4.5 text-orange-500 shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-semibold">SHIPPED TO</span>
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-0.5 leading-normal line-clamp-1">
                  {order.address}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Action Row Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
          <button
            onClick={() => navigate("products")}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all cursor-pointer"
            id="order-success-continue-btn"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </button>

          <button
            onClick={() => navigate("orders")}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            id="order-success-view-orders-btn"
          >
            <span>View My Orders</span>
          </button>
        </div>

      </div>
    </div>
  );
};
