/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storage } from "./storage";

export const authHelper = {
  getToken: (): string | null => {
    return storage.getItem("token");
  },

  getUsername: (): string | null => {
    return storage.getItem("username");
  },

  isAuthenticated: (): boolean => {
    const token = authHelper.getToken();
    const loginStatus = storage.getLoginStatus();
    return !!token && loginStatus;
  },

  saveLoginSession: (token: string, username: string, walletBalance?: number, addresses?: any[]): void => {
    storage.setItem("token", token);
    storage.setItem("username", username);
    if (walletBalance !== undefined) {
      storage.setItem("walletBalance", walletBalance.toString());
    }
    if (addresses !== undefined) {
      storage.setItem("addresses", JSON.stringify(addresses));
    }
    storage.setLoginStatus(true);
  },

  clearLoginSession: (): void => {
    storage.removeItem("token");
    storage.removeItem("username");
    storage.removeItem("walletBalance");
    storage.removeItem("addresses");
    storage.setItem("isLoggedIn", "false");
    storage.removeItem("cart");
  }
};
