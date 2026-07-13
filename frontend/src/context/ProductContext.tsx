/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import { Product } from "../types";
import { api } from "../services/api";

interface ProductContextType {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  fetchProducts: (q?: string, category?: string, sort?: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("");

  // Fetch products with optional filters
  const fetchProducts = async (q?: string, category?: string, sort?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      
      const activeQ = q !== undefined ? q : searchQuery;
      if (activeQ && activeQ.trim()) {
        params.q = activeQ.trim();
      }

      const activeCat = category !== undefined ? category : selectedCategory;
      if (activeCat && activeCat !== "All") {
        params.category = activeCat;
      }

      const activeSort = sort !== undefined ? sort : selectedSort;
      if (activeSort && activeSort !== "newest") {
        params.sort = activeSort;
      }

      const response = await api.get("/products", { params });
      let data = response.data;
      
      if (!Array.isArray(data)) {
        console.error("Received non-array products data:", data);
        if (data && typeof data === "object" && Array.isArray((data as any).products)) {
          data = (data as any).products;
        } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
          data = (data as any).data;
        } else {
          data = [];
        }
      }

      if (activeSort === "newest") {
        data = [...data].sort((a, b) => {
          const numA = parseInt(a.id.replace("prod-", ""), 10) || 0;
          const numB = parseInt(b.id.replace("prod-", ""), 10) || 0;
          return numB - numA;
        });
      }
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred while loading products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductById = async (id: string): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${id}`);
      return response.data as Product;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      setError(err.response?.data?.message || err.message || "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique categories from initial load
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get("/products");
        let allData = response.data;
        if (!Array.isArray(allData)) {
          console.error("Received non-array products in loadCategories:", allData);
          if (allData && typeof allData === "object" && Array.isArray((allData as any).products)) {
            allData = (allData as any).products;
          } else if (allData && typeof allData === "object" && Array.isArray((allData as any).data)) {
            allData = (allData as any).data;
          } else {
            allData = [];
          }
        }
        const uniqueCats: string[] = Array.from(new Set(allData.map((p: any) => p.category as string)));
        setCategories(["All", ...uniqueCats]);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Reactively fetch products when category or sort changes
  useEffect(() => {
    fetchProducts(searchQuery, selectedCategory, selectedSort);
  }, [selectedCategory, selectedSort]);

  // Debounced Search trigger from searchQuery (400ms exactly)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery, selectedCategory, selectedSort);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSort,
        setSelectedSort,
        fetchProducts,
        fetchProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
