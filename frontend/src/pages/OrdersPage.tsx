/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Order } from "../types";
import { Calendar, Package, MapPin, Receipt, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { ordersService } from "../services/ordersService";

interface OrdersPageProps {
  navigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ navigate }) => {
  const { token, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification("Please log in to view your orders.", "warning");
      navigate("login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await ordersService.getOrders();
        setOrders(data);
      } catch (err: any) {
        showNotification(err.message || "Could not retrieve order history", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-12" id="orders-loader">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading order history...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-16 animate-fadeIn" id="orders-page-container">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Your Order History
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review and track all your groceries and smart accessories transactions.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center select-none bg-zinc-50 dark:bg-zinc-950/40 rounded-3xl border border-zinc-100 dark:border-zinc-900/60 p-8">
          <div className="bg-orange-50 dark:bg-orange-950/20 text-orange-500 p-4 rounded-full mb-4">
            <ShoppingBag className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="font-extrabold text-zinc-700 dark:text-zinc-300 text-base mb-1">
            No orders found
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-6">
            You haven't placed any orders with your QKart account yet. Explore our delicious groceries, fresh fruits, snacks, and tech items!
          </p>
          <button
            onClick={() => navigate("products")}
            className="px-5 py-2.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6" id="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4"
            >
              {/* Top Row: Order ID and Total */}
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-100">
                    Order ID: {order.id}
                  </span>
                  <span className="text-[10px] text-zinc-400">&bull; {order.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">Total Paid</span>
                  <span className="text-sm font-black text-orange-600 dark:text-orange-400">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Middle Section: Items in Order */}
              <div className="flex flex-col gap-3 my-2">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-xl shrink-0 border border-zinc-100 dark:border-zinc-800 bg-zinc-50"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400 block font-semibold">
                          Category: {item.product.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        Qty: {item.quantity} &bull; ${item.product.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom section: Delivery date and Address info */}
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900/40 flex flex-col sm:flex-row justify-between gap-4 text-xs mt-2">
                <div className="flex gap-2 items-start">
                  <Package className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-semibold">Delivery Estimate</span>
                    <p className="font-extrabold text-zinc-800 dark:text-zinc-100 mt-0.5">
                      {order.deliveryDate} (Super Fast Shipping)
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-start max-w-sm">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-semibold">Shipping Coordinates</span>
                    <p className="font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5 leading-relaxed break-words">
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
