/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const storage = {
  setItem: (key: string, value: any): void => {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  },

  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return null;
    }
  },

  getParsedItem: <T>(key: string): T | null => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error parsing from localStorage", error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },

  setLoginStatus: (isLoggedIn: boolean): void => {
    storage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  },

  getLoginStatus: (): boolean => {
    return storage.getItem("isLoggedIn") === "true";
  }
};
