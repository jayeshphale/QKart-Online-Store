/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from "axios";

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
