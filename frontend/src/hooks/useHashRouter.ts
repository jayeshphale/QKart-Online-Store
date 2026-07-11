/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";

export type RoutePath = "home" | "login" | "register" | "products" | "product-details" | "checkout" | "order-success" | "orders" | "wishlist" | "404";

interface CurrentRoute {
  path: RoutePath;
  params: Record<string, string>;
  search: string;
}

export function useHashRouter() {
  const [route, setRoute] = useState<CurrentRoute>(() => parseHash());

  function parseHash(): CurrentRoute {
    const hash = window.location.hash || "#/";
    const rawPath = hash.slice(1).split("?")[0] || "/";
    const pathPart = rawPath.startsWith("/") ? rawPath : "/" + rawPath;
    const searchPart = hash.slice(1).split("?")[1] || "";

    const params: Record<string, string> = {};

    // Match exact routes
    if (pathPart === "/" || pathPart === "" || pathPart === "/home") {
      return { path: "home", params, search: searchPart };
    }
    if (pathPart === "/login") {
      return { path: "login", params, search: searchPart };
    }
    if (pathPart === "/register") {
      return { path: "register", params, search: searchPart };
    }
    if (pathPart === "/products") {
      return { path: "products", params, search: searchPart };
    }
    if (pathPart === "/checkout") {
      return { path: "checkout", params, search: searchPart };
    }
    if (pathPart === "/order-success") {
      return { path: "order-success", params, search: searchPart };
    }
    if (pathPart === "/orders") {
      return { path: "orders", params, search: searchPart };
    }
    if (pathPart === "/wishlist") {
      return { path: "wishlist", params, search: searchPart };
    }

    // Match path with parameters, e.g., /product/prod-1
    if (pathPart.startsWith("/product/")) {
      const parts = pathPart.split("/");
      const id = parts[2];
      if (id) {
        return { path: "product-details", params: { id }, search: searchPart };
      }
    }

    return { path: "404", params, search: searchPart };
  }

  useEffect(() => {
    if (!window.location.hash || window.location.hash === "#") {
      window.location.hash = "#/";
    }

    const handleHashChange = () => {
      setRoute(parseHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const navigate = (hashPath: string) => {
    // Navigate by setting location.hash
    window.location.hash = hashPath.startsWith("#") ? hashPath : `#${hashPath}`;
  };

  return {
    ...route,
    navigate
  };
}
