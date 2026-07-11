/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect } from "react";
import { useHashRouter } from "./hooks/useHashRouter";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { useNotification } from "./context/NotificationContext";

// Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Lazy Pages
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then(m => ({ default: m.ProductsPage })));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage").then(m => ({ default: m.ProductDetailsPage })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage").then(m => ({ default: m.OrderSuccessPage })));
const OrdersPage = lazy(() => import("./pages/OrdersPage").then(m => ({ default: m.OrdersPage })));
const WishlistPage = lazy(() => import("./pages/WishlistPage").then(m => ({ default: m.WishlistPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

// Dynamic loading loader screen
const PageLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3" id="page-suspense-loader">
    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
    <span className="text-xs font-bold text-zinc-400">Loading requested resources...</span>
  </div>
);

// Destination-preserving redirect component
interface RedirectToLoginProps {
  navigate: (path: string) => void;
}

const RedirectToLogin: React.FC<RedirectToLoginProps> = ({ navigate }) => {
  const { showNotification } = useNotification();
  
  useEffect(() => {
    // Preserve the current hash path
    const currentHash = window.location.hash;
    if (currentHash && !currentHash.includes("login") && !currentHash.includes("register")) {
      sessionStorage.setItem("qkart_redirect_to", currentHash);
    }
    
    showNotification("Access denied. Please login first to view this page.", "warning");
    navigate("login");
  }, [navigate, showNotification]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2" id="redirecting-to-login">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      <span className="text-xs font-semibold text-zinc-400">Redirecting to login...</span>
    </div>
  );
};

function AppContent() {
  const router = useHashRouter();
  const { isAuthenticated } = useAuth();

  const renderActivePage = () => {
    // Check for route protection requirements
    const isProtected = ["checkout", "orders", "order-success"].includes(router.path);
    if (isProtected && !isAuthenticated) {
      return <RedirectToLogin navigate={router.navigate} />;
    }

    switch (router.path) {
      case "home":
        return <HomePage navigate={router.navigate} />;
      case "login":
        return <LoginPage navigate={router.navigate} />;
      case "register":
        return <RegisterPage navigate={router.navigate} />;
      case "products":
        return <ProductsPage navigate={router.navigate} />;
      case "product-details":
        return (
          <ProductDetailsPage
            productId={router.params.id}
            navigate={router.navigate}
          />
        );
      case "checkout":
        return <CheckoutPage navigate={router.navigate} />;
      case "order-success":
        return <OrderSuccessPage navigate={router.navigate} />;
      case "orders":
        return <OrdersPage navigate={router.navigate} />;
      case "wishlist":
        return <WishlistPage navigate={router.navigate} />;
      case "404":
      default:
        return <NotFoundPage navigate={router.navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      
      {/* Sticky Header Nav */}
      <Header currentPath={router.path} navigate={router.navigate} />

      {/* Main Container Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            {renderActivePage()}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Sliding Drawer Cart */}
      <CartDrawer navigate={router.navigate} />

      {/* Footer layout */}
      <Footer navigate={router.navigate} />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}
