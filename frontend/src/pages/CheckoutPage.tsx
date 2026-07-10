/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CreditCard, MapPin, Loader2, Wallet, ArrowLeft, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { AddressList } from "../components/AddressList";
import { AddressForm } from "../components/AddressForm";
import { OrderSummary } from "../components/OrderSummary";
import { ordersService } from "../services/ordersService";

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { user, isAuthenticated, token, addAddress, editAddress, deleteAddress, setWalletBalance, addWalletFunds } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { showNotification } = useNotification();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [editingAddressText, setEditingAddressText] = useState("");
  
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const [showAddFundsInline, setShowAddFundsInline] = useState(false);
  const [inlineFundsAmt, setInlineFundsAmt] = useState("");
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  // Authenticated route protection
  useEffect(() => {
    if (!isAuthenticated) {
      showNotification("Please login to continue.", "warning");
      navigate("login");
    }
  }, [isAuthenticated, navigate, showNotification]);

  // Ensure cart is not empty, otherwise redirect
  useEffect(() => {
    if (isAuthenticated && cartItems.length === 0) {
      showNotification("Your cart is empty. Please add items before checking out.", "info");
      navigate("products");
    }
  }, [cartItems, isAuthenticated, navigate, showNotification]);

  const handleAddNewAddress = async (addressText: string): Promise<boolean> => {
    setIsLoadingAddresses(true);
    const res = await addAddress(addressText);
    setIsLoadingAddresses(false);

    if (res.success) {
      showNotification("Delivery address saved successfully!", "success");
      // Select the newly added address
      if (user) {
        setSelectedAddressIndex(user.addresses.length);
      }
      return true;
    } else {
      showNotification(res.message, "error");
      return false;
    }
  };

  const handleEditAddressClick = (index: number, currentText: string) => {
    setEditingAddressIndex(index);
    setEditingAddressText(currentText);
  };

  const handleEditAddressSubmit = async (addressText: string): Promise<boolean> => {
    if (editingAddressIndex === null) return false;

    setIsLoadingAddresses(true);
    const res = await editAddress(editingAddressIndex, addressText);
    setIsLoadingAddresses(false);

    if (res.success) {
      showNotification("Delivery address updated successfully!", "success");
      setEditingAddressIndex(null);
      setEditingAddressText("");
      return true;
    } else {
      showNotification(res.message, "error");
      return false;
    }
  };

  const handleDeleteAddressClick = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsLoadingAddresses(true);
    const res = await deleteAddress(index);
    setIsLoadingAddresses(false);

    if (res.success) {
      showNotification("Delivery address removed successfully.", "success");
      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(0);
      } else if (selectedAddressIndex > index) {
        setSelectedAddressIndex(selectedAddressIndex - 1);
      }
      if (editingAddressIndex === index) {
        setEditingAddressIndex(null);
        setEditingAddressText("");
      }
    } else {
      showNotification(res.message, "error");
    }
  };

  const handleAddFundsInline = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(inlineFundsAmt);
    if (isNaN(amt) || amt <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    setIsAddingFunds(true);
    const res = await addWalletFunds(amt);
    setIsAddingFunds(false);

    if (res.success) {
      showNotification(res.message, "success");
      setInlineFundsAmt("");
      setShowAddFundsInline(false);
    } else {
      showNotification(res.message, "error");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    if (cartItems.length === 0) {
      showNotification("Cart is empty", "error");
      return;
    }

    if (user.addresses.length === 0) {
      showNotification("No address selected", "error");
      return;
    }

    const deliveryAddress = user.addresses[selectedAddressIndex];
    if (!deliveryAddress) {
      showNotification("No address selected", "error");
      return;
    }

    // Client-side Wallet Balance Validation
    if (user.walletBalance < cartTotal) {
      showNotification("Insufficient wallet balance.", "warning");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const res = await ordersService.checkout(deliveryAddress);

      if (res.success && res.order) {
        // Update wallet balance immediately in context & local storage
        if (typeof res.order.walletBalanceRemaining === "number") {
          setWalletBalance(res.order.walletBalanceRemaining);
        }

        // Save order receipt to sessionStorage so Success page can show details
        sessionStorage.setItem("last_order", JSON.stringify(res.order));

        // Clear cart
        clearCart();

        showNotification("Order placed successfully!", "success");
        navigate("order-success");
      } else {
        showNotification(res.message || "Failed to place order", "error");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Checkout failed due to network error.";
      showNotification(errMsg, "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]" id="checkout-loader">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-2" />
        <p className="text-xs text-zinc-400 font-bold">Verifying checkout session...</p>
      </div>
    );
  }

  const isBalanceInsufficient = user.walletBalance < cartTotal;

  return (
    <div className="flex flex-col gap-6 pb-16 animate-fadeIn animate-duration-300" id="checkout-page-container">
      
      {/* Back link and title */}
      <div>
        <button
          onClick={() => navigate("products")}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors mb-2 cursor-pointer"
          id="checkout-back-link"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to products</span>
        </button>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Checkout Securely
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review your items, select your delivery address, and place your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Address & Wallet) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 1. Address Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4" id="address-section-card">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
              <MapPin className="w-5 h-5 animate-pulse" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                1. Delivery Coordinates
              </h3>
            </div>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Select one existing address for your super-fast shipping, or add a new delivery location below.
            </p>

            {/* Address List */}
            {isLoadingAddresses ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            ) : (
              <AddressList
                addresses={user.addresses}
                selectedAddressIndex={selectedAddressIndex}
                onSelectAddress={(idx) => {
                  setSelectedAddressIndex(idx);
                  if (editingAddressIndex !== null) {
                    setEditingAddressIndex(null);
                    setEditingAddressText("");
                  }
                }}
                onEditAddress={handleEditAddressClick}
                onDeleteAddress={handleDeleteAddressClick}
              />
            )}

            {/* Address Form (Add / Edit) */}
            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-2">
              <AddressForm
                key={editingAddressIndex !== null ? `edit-${editingAddressIndex}` : "add-new"}
                initialValue={editingAddressIndex !== null ? editingAddressText : ""}
                isEditMode={editingAddressIndex !== null}
                isSubmitting={isLoadingAddresses}
                onSubmit={editingAddressIndex !== null ? handleEditAddressSubmit : handleAddNewAddress}
                onCancelEdit={() => {
                  setEditingAddressIndex(null);
                  setEditingAddressText("");
                }}
              />
            </div>
          </div>

          {/* 2. Payment Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4" id="payment-section-card">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  2. Virtual Wallet Payment
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 px-3 py-1 rounded-xl" id="checkout-wallet-balance-display">
                <Wallet className="w-3.5 h-3.5 text-zinc-400" />
                <span>Wallet Balance: <strong className="text-zinc-800 dark:text-zinc-200" id="wallet-balance">${user.walletBalance.toFixed(2)}</strong></span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              Payment is processed securely using your virtual QKart wallet. No actual credit card details are collected.
            </p>

            {isBalanceInsufficient ? (
              <div className="bg-rose-50 dark:bg-rose-950/25 border border-rose-200/50 text-rose-900 dark:text-rose-100 p-4 rounded-2xl flex flex-col gap-3" id="insufficient-balance-alert">
                <p className="text-xs font-bold leading-relaxed">
                  ⚠️ <strong>Insufficient Balance:</strong> Your order total is <strong>${cartTotal.toFixed(2)}</strong>, but your wallet only holds <strong>${user.walletBalance.toFixed(2)}</strong>. Please top up your virtual QKart wallet below to continue.
                </p>
                {!showAddFundsInline ? (
                  <button
                    onClick={() => setShowAddFundsInline(true)}
                    className="w-fit px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer self-start"
                    id="top-up-trigger-btn"
                  >
                    Top up virtual funds now
                  </button>
                ) : (
                  <form onSubmit={handleAddFundsInline} className="flex flex-col sm:flex-row gap-2 mt-1" id="top-up-form">
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Funds to add, e.g. 500"
                      value={inlineFundsAmt}
                      onChange={(e) => setInlineFundsAmt(e.target.value)}
                      className="flex-1 max-w-[220px] p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs outline-none text-zinc-800 dark:text-zinc-200 focus:border-rose-600"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isAddingFunds}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1"
                        id="add-funds-btn"
                      >
                        {isAddingFunds && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{isAddingFunds ? "Adding..." : "Add Funds"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddFundsInline(false); setInlineFundsAmt(""); }}
                        className="px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5" id="wallet-funds-status">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Virtual wallet holds sufficient funds! Estimated balance after placement: <strong>${(user.walletBalance - cartTotal).toFixed(2)}</strong></span>
              </div>
            )}

          </div>

        </div>

        {/* Right Column (Cart Summary & Order Summary & Place button) */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
            
            {/* Place Order Button card */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || isBalanceInsufficient || user.addresses.length === 0}
                className="w-full h-12 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
                id="checkout-place-order-btn"
              >
                {isPlacingOrder ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                <span>Place QKart Order</span>
              </button>

              {user.addresses.length === 0 && (
                <p className="text-[10px] text-rose-500 text-center font-bold" id="no-address-error-helper">
                  * Please save and select a shipping coordinates location to unlock.
                </p>
              )}
              {isBalanceInsufficient && user.addresses.length > 0 && (
                <p className="text-[10px] text-rose-500 text-center font-bold" id="insufficient-funds-error-helper">
                  * Wallet balance is insufficient to complete the order.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
