/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from "axios";
import { authHelper } from "../utils/authHelper";

// Dynamic API Base URL from Vite environment variables or defaults to "/api/v1"
let API_URL = (import.meta as any).env?.VITE_API_URL || "/api/v1";
if (API_URL.includes("localhost:5000") || API_URL.includes("127.0.0.1:5000")) {
  API_URL = "/api/v1";
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to inject JWT Authorization token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401/403 authorization errors gracefully
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const isProfileVerification = error.config && error.config.url && error.config.url.includes("/auth/profile");
      const currentToken = localStorage.getItem("token");
      if (currentToken && !isProfileVerification) {
        console.warn("Session expired or invalid token. Clearing login session...");
        authHelper.clearLoginSession();
        // Force reload page to reset all React Context states back to guest/unauthenticated
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);
