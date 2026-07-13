/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingCart, 
  LogOut, 
  Sun, 
  Moon, 
  Search, 
  LogIn, 
  UserPlus, 
  Wallet, 
  Plus, 
  X, 
  Menu, 
  Receipt, 
  Heart,
  MapPin,
  ChevronDown,
  Globe,
  Smartphone,
  Tag,
  HelpCircle,
  Truck,
  Grid,
  Gift,
  Tv,
  Gamepad2,
  Book,
  Home,
  Sparkles,
  Utensils,
  Sofa,
  Smile,
  Dribbble,
  Wrench,
  Baby,
  Layers,
  Check
} from "lucide-react";
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
  const { cartCount, setIsCartOpen, wishlistItems } = useCart();
  const { searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory, products } = useProducts();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showNotification } = useNotification();

  // Modal / Dropdown states
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [pincode, setPincode] = useState("400001");
  const [city, setCity] = useState("Mumbai");
  const [inputPincode, setInputPincode] = useState("");
  
  // Custom selectors
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  // Suggestion states
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 1) {
      // Find matching products
      const matches = products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .map((p) => p.name)
        .slice(0, 6);
      // Add unique values
      setSuggestions(Array.from(new Set(matches)));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    if (currentPath !== "products" && query.trim().length > 2) {
      navigate("products");
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
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
    setAccountDropdownOpen(false);
    navigate("home");
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPincode || inputPincode.trim().length !== 6 || isNaN(Number(inputPincode))) {
      showNotification("Please enter a valid 6-digit PIN code", "error");
      return;
    }
    
    setPincode(inputPincode);
    // Auto map some pincodes for premium feel
    if (inputPincode.startsWith("11")) {
      setCity("New Delhi");
    } else if (inputPincode.startsWith("40")) {
      setCity("Mumbai");
    } else if (inputPincode.startsWith("56")) {
      setCity("Bengaluru");
    } else if (inputPincode.startsWith("60")) {
      setCity("Chennai");
    } else if (inputPincode.startsWith("70")) {
      setCity("Kolkata");
    } else if (inputPincode.startsWith("50")) {
      setCity("Hyderabad");
    } else {
      setCity("India");
    }
    
    showNotification(`Delivery location updated to ${inputPincode}!`, "success");
    setIsLocationOpen(false);
    setInputPincode("");
  };

  // Nav category mappings with icons
  const navCategories = [
    { name: "Mobiles", icon: Smartphone },
    { name: "Electronics", icon: Tv },
    { name: "Fashion", icon: Tag },
    { name: "Laptops", icon: Layers },
    { name: "Gaming", icon: Gamepad2 },
    { name: "Books", icon: Book },
    { name: "Home Appliances", icon: Home },
    { name: "Kitchen", icon: Utensils },
    { name: "Furniture", icon: Sofa },
    { name: "Beauty", icon: Smile },
    { name: "Sports", icon: Dribbble },
    { name: "Automotive", icon: Wrench },
    { name: "Toys", icon: Baby }
  ];

  const handleCategoryNavClick = (catName: string) => {
    setSelectedCategory(catName);
    navigate("products");
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] py-1.5 px-4 border-b border-zinc-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 hover:text-amber-400 cursor-pointer transition-colors" onClick={() => { setSelectedCategory("All"); navigate("products"); }}>
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>Today's Deals</span>
            </span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Customer Service</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Gift Cards</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Sell</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-0.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Track Order</span>
            </span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </span>

            {/* Language Dropdown Selector */}
            <div className="relative">
              <button 
                onClick={() => { setLangDropdownOpen(!langDropdownOpen); setCountryDropdownOpen(false); }}
                className="flex items-center gap-1 hover:text-amber-400 transition-colors focus:outline-none"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{selectedLang === "EN" ? "English" : selectedLang === "HI" ? "हिन्दी" : "English"}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden">
                  {[
                    { code: "EN", label: "English" },
                    { code: "HI", label: "हिन्दी" },
                    { code: "ES", label: "Español" }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); setLangDropdownOpen(false); showNotification(`Language switched to ${lang.label}!`, "info"); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 transition-colors flex items-center justify-between"
                    >
                      <span>{lang.label}</span>
                      {selectedLang === lang.code && <Check className="w-3 h-3 text-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Country Dropdown Selector */}
            <div className="relative">
              <button 
                onClick={() => { setCountryDropdownOpen(!countryDropdownOpen); setLangDropdownOpen(false); }}
                className="flex items-center gap-1 hover:text-amber-400 transition-colors focus:outline-none"
              >
                <span>{selectedCountry === "IN" ? "🇮🇳 India" : selectedCountry === "US" ? "🇺🇸 USA" : "🇮🇳 India"}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {countryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden">
                  {[
                    { code: "IN", label: "🇮🇳 India" },
                    { code: "US", label: "🇺🇸 USA" },
                    { code: "GB", label: "🇬🇧 UK" }
                  ].map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setSelectedCountry(c.code); setCountryDropdownOpen(false); showNotification(`Country changed to ${c.label}!`, "info"); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 transition-colors flex items-center justify-between"
                    >
                      <span>{c.label}</span>
                      {selectedCountry === c.code && <Check className="w-3 h-3 text-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 text-white transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left Section: Logo & Delivery Location */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Logo */}
            <div 
              onClick={() => navigate("home")}
              className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
              id="header-logo"
            >
              <div className="bg-gradient-to-tr from-amber-400 to-amber-500 text-zinc-950 font-bold p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200">
                <span className="text-xl tracking-tight px-1 font-extrabold">Q</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Kart<span className="text-amber-400 font-normal text-xs ml-0.5">Market</span>
              </span>
            </div>

            {/* Delivery Location Selector */}
            <div 
              onClick={() => setIsLocationOpen(true)}
              className="hidden lg:flex items-center gap-1.5 cursor-pointer hover:border hover:border-zinc-700 p-1.5 rounded-lg border border-transparent select-none transition-all group"
              title="Change Delivery Pincode"
            >
              <MapPin className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 leading-none">Deliver to</span>
                <span className="text-xs font-bold text-zinc-100 group-hover:text-amber-400 leading-normal">
                  {city} {pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Center Section: Large Search Bar with Search Suggestions & Category Dropdown */}
          <div className="hidden md:flex flex-1 max-w-2xl relative items-center bg-white dark:bg-zinc-900 border border-transparent focus-within:ring-2 focus-within:ring-amber-500 rounded-xl overflow-visible transition-all" id="header-search-container">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (currentPath !== "products") {
                  navigate("products");
                }
              }}
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold px-3 py-2.5 border-r border-zinc-200 dark:border-zinc-700 outline-none cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors h-full rounded-l-xl"
              id="header-category-select"
            >
              {(categories.includes(selectedCategory) ? categories : [...categories, selectedCategory]).map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search mobiles, electronics, fashion, books..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 h-full"
              id="header-search-input"
            />

            <button
              onClick={() => navigate("products")}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-5 py-2.5 h-full flex items-center justify-center transition-colors font-semibold text-xs cursor-pointer rounded-r-xl"
              id="header-search-btn"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Suggestions Dropdown (Amazon style overlay) */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionRef}
                className="absolute top-12 left-0 right-0 bg-white text-zinc-800 border border-zinc-200 rounded-xl shadow-2xl z-50 overflow-hidden mt-1 max-h-72 overflow-y-auto"
              >
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 cursor-pointer text-sm font-medium transition-colors text-zinc-700"
                  >
                    <Search className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Controls, Theme, Cart, My Account Dropdown */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0" id="header-controls">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} /> : <Moon className="w-5 h-5 text-zinc-300" />}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate("wishlist")}
              className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                currentPath === "wishlist"
                  ? "text-rose-500 bg-zinc-800"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
              title="View Wishlist"
              id="wishlist-toggle-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-900">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Button with Pulsing Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
              title="Open Shopping Cart"
              id="cart-toggle-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Wallet Balance (Logged In) - Clickable to launch Wallet addition dialog */}
            {isAuthenticated && user && (
              <div className="relative">
                <button
                  onClick={() => setIsWalletOpen(!isWalletOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-amber-400 border border-zinc-700 text-xs font-semibold hover:bg-zinc-700 transition-all cursor-pointer"
                  id="wallet-toggle-btn"
                  title="Add mock cash to Wallet"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>${user.walletBalance.toFixed(2)}</span>
                  <Plus className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            )}

            {/* User Controls: My Account Dropdown Option (Amazon Inspired) */}
            {isAuthenticated && user ? (
              <div className="hidden lg:relative lg:block">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer font-bold text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-bold text-xs shadow-sm select-none">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[9px] text-zinc-400 font-normal">Hello, {user.username}</span>
                    <span className="text-xs font-bold text-white flex items-center">
                      My Account <ChevronDown className="w-3 h-3 ml-0.5 text-zinc-400" />
                    </span>
                  </div>
                </button>

                {/* Account Dropdown Card */}
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 py-2 text-zinc-200 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="text-[10px] text-zinc-500">Logged in as</p>
                      <p className="text-xs font-bold text-zinc-100">{user.username}</p>
                      <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Wallet: ${user.walletBalance.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => { setAccountDropdownOpen(false); navigate("orders"); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <Receipt className="w-3.5 h-3.5 text-zinc-400" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => { setAccountDropdownOpen(false); navigate("wishlist"); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-zinc-400" />
                      <span>My Wishlist</span>
                    </button>
                    <button
                      onClick={() => { setAccountDropdownOpen(false); setIsWalletOpen(true); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-800 transition-colors flex items-center gap-2"
                    >
                      <Wallet className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Add Funds</span>
                    </button>
                    <hr className="border-zinc-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-rose-950/30 text-rose-400 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => navigate("login")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
                  id="login-nav-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate("register")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90 text-zinc-950 rounded-xl shadow-md transition-all cursor-pointer"
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
              className="lg:hidden p-2 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
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

        {/* 3. CATEGORY NAVIGATION BAR (Rendered globally on all headers for extreme convenience) */}
        <div className="bg-zinc-950 border-t border-zinc-800 text-xs px-4 overflow-x-auto scrollbar-none flex items-center select-none py-1 h-10">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-1 sm:gap-4 shrink-0">
            {/* All Category toggle */}
            <button 
              onClick={() => handleCategoryNavClick("All")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all text-xs font-semibold whitespace-nowrap cursor-pointer hover:bg-zinc-800 ${
                selectedCategory === "All" ? "bg-amber-500 text-zinc-950 font-extrabold" : "text-zinc-300"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Products</span>
            </button>

            <span className="text-zinc-700 font-light">|</span>

            {/* Custom Category lists with beautiful responsive icons */}
            {navCategories.map((cat, i) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={i}
                  onClick={() => handleCategoryNavClick(cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[11px] font-semibold whitespace-nowrap cursor-pointer hover:bg-zinc-800 ${
                    isSelected ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-zinc-300 border border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-4 py-3 flex flex-col gap-2.5 animate-fadeIn">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2.5 px-2 py-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{user.username}</div>
                    <div className="text-[11px] text-zinc-400">Authenticated Member &middot; Wallet Balance: ${user.walletBalance.toFixed(2)}</div>
                  </div>
                </div>
                <hr className="border-zinc-100 dark:border-zinc-900" />
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("products"); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <span>Browse Products</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("orders"); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                >
                  <Receipt className="w-4 h-4 text-zinc-400" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate("wishlist"); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-zinc-400" />
                  <span>My Wishlist</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setIsWalletOpen(true); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4 text-zinc-400" />
                  <span>Add Wallet Funds</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
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
                  className="w-full text-center py-2.5 text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 rounded-xl"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Delivery Pincode Selector Modal */}
      {isLocationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="pincode-modal">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative">
            <button
              onClick={() => setIsLocationOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-4 text-amber-600 dark:text-amber-500">
              <MapPin className="w-6 h-6 animate-bounce" />
              <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">Select Delivery Location</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
              Enter a valid 6-digit PIN code to check regional stock availability, exact delivery schedules, and exclusive regional promo discounts.
            </p>
            <form onSubmit={handlePincodeSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Enter 6-digit Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 400001 or 560001"
                  value={inputPincode}
                  onChange={(e) => setInputPincode(e.target.value)}
                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded-xl outline-none text-sm focus:border-amber-500 text-zinc-800 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setIsLocationOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md"
                >
                  Apply Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-2 mb-4 text-amber-500 dark:text-amber-400">
              <Wallet className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-bold">Add Wallet Funds</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
              Your current balance is <strong className="text-zinc-800 dark:text-zinc-200">${user.walletBalance.toFixed(2)}</strong>. Add virtual mockup funds to buy premium items!
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
                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 bg-transparent rounded-xl outline-none text-sm focus:border-amber-500 text-zinc-800 dark:text-white"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 hover:opacity-90 disabled:opacity-50 shadow-md"
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
