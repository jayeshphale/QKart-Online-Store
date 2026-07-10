/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShoppingCart, LogOut, Sun, Moon, Search, LogIn, UserPlus, Wallet, Plus, X, Menu, Receipt } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { user, isAuthenticated, logout, addWalletFunds } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { searchQuery, setSearchQuery } = useProducts();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showNotification } = useNotification();

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentPath !== "products") {
      navigate("products");
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(addFundsAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    setIsAddingFunds(true);
    const result = await addWalletFunds(amount);
    setIsAddingFunds(false);

    if (result.success) {
      showNotification(result.message, "success");
      setIsWalletOpen(false);
      setAddFundsAmount("");
    } else {
      showNotification(result.message, "error");
    }
  };

  const handleLogout = () => {
    logout();
    showNotification("Logged out successfully", "success");
    navigate("home");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => navigate("home")}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
            id="header-logo"
          >
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-bold p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl tracking-tight px-1 font-extrabold">Q</span>
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Kart
            </span>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative" id="header-search-container">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by product, category, or detail..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-900 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500/80 rounded-xl outline-none transition-all text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
              id="header-search-input"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0" id="header-controls">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              title="Open Shopping Cart"
              id="cart-toggle-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-zinc-950 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Wallet Balance (Logged In) */}
            {isAuthenticated && user && (
              <div className="relative">
                <button
                  onClick={() => setIsWalletOpen(!isWalletOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30 text-xs font-semibold hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-all cursor-pointer"
                  id="wallet-toggle-btn"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>${user.walletBalance.toFixed(2)}</span>
                  <Plus className="w-3 h-3 text-orange-500" />
                </button>
              </div>
            )}

            {/* User Controls */}
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center gap-3">
                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-sm select-none">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {user.username}
                  </span>
                </div>

                {/* Orders Button */}
                <button
                  onClick={() => navigate("orders")}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                    currentPath === "orders"
                      ? "bg-orange-500 text-white border-transparent"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-transparent"
                  }`}
                  id="header-orders-btn"
                >
                  <Receipt className="w-4 h-4" />
                  <span>My Orders</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer font-medium"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => navigate("login")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all cursor-pointer"
                  id="login-nav-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate("register")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all cursor-pointer"
                  id="register-nav-btn"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              id="mobile-menu-toggle-btn"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-zinc-100 dark:border-zinc-900">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-900 border border-transparent rounded-xl outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
              id="mobile-search-input"
            />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-4 py-3 flex flex-col gap-2.5 animate-fadeIn">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2.5 px-2 py-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{user.username}</div>
                    <div className="text-[11px] text-zinc-400">Authenticated Member</div>
                  </div>
                </div>
                <hr className="border-zinc-100 dark:border-zinc-900" />
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("products"); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                >
                  Browse Products
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("orders"); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                >
                  My Orders
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("login"); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("register"); }}
                  className="w-full text-center py-2.5 text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Add Funds Modal */}
      {isWalletOpen && isAuthenticated && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="wallet-modal">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xl max-w-sm w-full relative">
            <button
              onClick={() => setIsWalletOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4 text-orange-600 dark:text-orange-500">
              <Wallet className="w-6 h-6" />
              <h3 className="text-lg font-bold">Add Wallet Funds</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Your current balance is <strong className="text-zinc-800 dark:text-zinc-200">${user.walletBalance.toFixed(2)}</strong>. Add virtual mockup funds to buy more delicious items.
            </p>
            <form onSubmit={handleAddFunds} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Amount to add ($)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="e.g. 500"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded-xl outline-none text-sm focus:border-orange-500"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setIsWalletOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingFunds}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {isAddingFunds ? "Adding..." : "Add Funds"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
