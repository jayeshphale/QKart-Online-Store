/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "../types";
import { api } from "../services/api";
import { storage } from "../utils/storage";
import { authHelper } from "../utils/authHelper";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  addAddress: (address: string) => Promise<{ success: boolean; message: string }>;
  editAddress: (index: number, address: string) => Promise<{ success: boolean; message: string }>;
  deleteAddress: (index: number) => Promise<{ success: boolean; message: string }>;
  addWalletFunds: (amount: number) => Promise<{ success: boolean; message: string; balance?: number }>;
  setWalletBalance: (balance: number) => void;
  reloadSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on load
  useEffect(() => {
    const storedToken = authHelper.getToken();
    const storedUsername = authHelper.getUsername();
    const storedBalance = storage.getItem("walletBalance");
    const storedAddresses = storage.getItem("addresses");

    if (storedToken && storedUsername && storage.getLoginStatus()) {
      setToken(storedToken);
      setUser({
        username: storedUsername,
        walletBalance: storedBalance ? parseFloat(storedBalance) : 5000.00,
        addresses: storedAddresses ? JSON.parse(storedAddresses) : []
      });
    } else {
      // Clear out any broken session states
      authHelper.clearLoginSession();
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      const data = response.data;

      setToken(data.token);
      const newUser: User = {
        username: data.username,
        walletBalance: data.walletBalance,
        addresses: data.addresses || []
      };
      setUser(newUser);

      // Save using authHelper
      authHelper.saveLoginSession(data.token, data.username, data.walletBalance, data.addresses || []);

      return { success: true, message: "Logged in successfully" };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to login";
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", { username, password });
      const data = response.data;

      return { success: true, message: data.message || "Registered Successfully" };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to register";
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    authHelper.clearLoginSession();
  };

  const addAddress = async (address: string) => {
    if (!token) return { success: false, message: "Please log in first" };
    try {
      const response = await api.post("/addresses", { address });
      const data = response.data;

      if (user) {
        const updatedUser = { ...user, addresses: data.addresses };
        setUser(updatedUser);
        localStorage.setItem("addresses", JSON.stringify(data.addresses));
      }

      return { success: true, message: "Address added successfully" };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to add address";
      return { success: false, message: errMsg };
    }
  };

  const editAddress = async (index: number, address: string) => {
    if (!token) return { success: false, message: "Please log in first" };
    try {
      const response = await api.put(`/addresses/${index}`, { address });
      const data = response.data;

      if (user) {
        const updatedUser = { ...user, addresses: data.addresses };
        setUser(updatedUser);
        localStorage.setItem("addresses", JSON.stringify(data.addresses));
      }

      return { success: true, message: "Address updated successfully" };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update address";
      return { success: false, message: errMsg };
    }
  };

  const deleteAddress = async (index: number) => {
    if (!token) return { success: false, message: "Please log in first" };
    try {
      const response = await api.delete(`/addresses/${index}`);
      const data = response.data;

      if (user) {
        const updatedUser = { ...user, addresses: data.addresses };
        setUser(updatedUser);
        localStorage.setItem("addresses", JSON.stringify(data.addresses));
      }

      return { success: true, message: "Address deleted successfully" };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to delete address";
      return { success: false, message: errMsg };
    }
  };

  const addWalletFunds = async (amount: number) => {
    if (!token) return { success: false, message: "Please log in first" };
    try {
      const response = await api.post("/wallet/add", { amount });
      const data = response.data;

      if (user) {
        const updatedUser = { ...user, walletBalance: data.walletBalance };
        setUser(updatedUser);
        localStorage.setItem("walletBalance", data.walletBalance.toString());
      }

      return { success: true, message: `Added $${amount.toFixed(2)} to wallet successfully`, balance: data.walletBalance };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to add funds";
      return { success: false, message: errMsg };
    }
  };

  const setWalletBalance = (balance: number) => {
    if (user) {
      const updatedUser = { ...user, walletBalance: balance };
      setUser(updatedUser);
      localStorage.setItem("walletBalance", balance.toString());
    }
  };

  const reloadSession = () => {
    const storedToken = authHelper.getToken();
    const storedUsername = authHelper.getUsername();
    const storedBalance = storage.getItem("walletBalance");
    const storedAddresses = storage.getItem("addresses");

    if (storedToken && storedUsername && storage.getLoginStatus()) {
      setToken(storedToken);
      setUser({
        username: storedUsername,
        walletBalance: storedBalance ? parseFloat(storedBalance) : 5000.00,
        addresses: storedAddresses ? JSON.parse(storedAddresses) : []
      });
    } else {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        addAddress,
        editAddress,
        deleteAddress,
        addWalletFunds,
        setWalletBalance,
        reloadSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
