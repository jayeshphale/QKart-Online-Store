/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProductsPage } from "../pages/ProductsPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AddressList } from "../components/AddressList";
import { AddressForm } from "../components/AddressForm";
import { SearchBar } from "../components/SearchBar";

// Mock providers and navigation
const mockNavigate = jest.fn();

// Mock contexts
jest.mock("../context/ThemeContext", () => ({
  useTheme: () => ({ isDarkMode: false, toggleTheme: jest.fn() })
}));

jest.mock("../context/NotificationContext", () => ({
  useNotification: () => ({ showNotification: jest.fn() })
}));

jest.mock("../context/ProductContext", () => ({
  useProducts: () => ({
    products: [
      { id: "p1", name: "Organic Apples", category: "Fruits", price: 4.99, rating: 4.5, image: "", description: "Fresh apples", stock: 100 },
      { id: "p2", name: "Premium Laptop", category: "Electronics", price: 999.99, rating: 4.8, image: "", description: "Fast laptop", stock: 10 }
    ],
    categories: ["Fruits", "Electronics"],
    isLoading: false,
    error: null,
    searchQuery: "",
    setSearchQuery: jest.fn(),
    selectedCategory: "All",
    setSelectedCategory: jest.fn(),
    selectedSort: "",
    setSelectedSort: jest.fn(),
    fetchProducts: jest.fn()
  })
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { username: "testuser", walletBalance: 500, addresses: ["10 Downing St, London"] },
    isAuthenticated: true,
    addAddress: jest.fn().mockResolvedValue({ success: true }),
    editAddress: jest.fn().mockResolvedValue({ success: true }),
    deleteAddress: jest.fn().mockResolvedValue({ success: true }),
    reloadSession: jest.fn()
  })
}));

describe("QKart Frontend Components & Flow Compatibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Registration: Page renders with inputs and submit button", () => {
    render(<RegisterPage navigate={mockNavigate} />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register now/i })).toBeInTheDocument();
  });

  test("Login: Page renders with credentials input and triggers validation", async () => {
    render(<LoginPage navigate={mockNavigate} />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    
    const loginButton = screen.getByRole("button", { name: /login now/i });
    fireEvent.click(loginButton);
    
    // SnackBar validation should be raised if inputs are blank
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  test("Product Listing: Renders mocked list of produce and electronics cards", () => {
    render(<ProductsPage navigate={mockNavigate} />);
    
    expect(screen.getByText("Organic Apples")).toBeInTheDocument();
    expect(screen.getByText("Premium Laptop")).toBeInTheDocument();
    expect(screen.getByText("$4.99")).toBeInTheDocument();
    expect(screen.getByText("$999.99")).toBeInTheDocument();
  });

  test("Search: Input field updates local state and propagates queries with debouncing", async () => {
    const mockOnChange = jest.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    fireEvent.change(searchInput, { target: { value: "Strawberry" } });
    
    expect(searchInput).toHaveValue("Strawberry");
    
    // Wait for the debouncer (450ms)
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith("Strawberry");
    }, { timeout: 1000 });
  });

  test("Address coordinates rendering: Correct index and labels are shown", () => {
    const mockSelect = jest.fn();
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();
    
    render(
      <AddressList
        addresses={["10 Downing St, London"]}
        selectedAddressIndex={0}
        onSelectAddress={mockSelect}
        onEditAddress={mockEdit}
        onDeleteAddress={mockDelete}
      />
    );
    
    expect(screen.getByText("10 Downing St, London")).toBeInTheDocument();
    expect(screen.getByText("Address #1")).toBeInTheDocument();
  });

  test("Address Form: Submits valid address and invokes handler", async () => {
    const mockSubmit = jest.fn().mockResolvedValue(true);
    render(<AddressForm onSubmit={mockSubmit} />);
    
    const input = screen.getByPlaceholderText(/type complete shipping address/i);
    fireEvent.change(input, { target: { value: "123 Baker Street, London NW1 6XE" } });
    
    const submitBtn = screen.getByRole("button", { name: /save address/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith("123 Baker Street, London NW1 6XE");
    });
  });
});
