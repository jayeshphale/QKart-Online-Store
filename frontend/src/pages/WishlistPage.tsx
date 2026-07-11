/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Trash2, Heart, ArrowRight } from "lucide-react";
import { Product } from "../types";
import { useNotification } from "../context/NotificationContext";

interface WishlistPageProps {
  navigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate }) => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = async (product: Product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      showNotification("Added item to shopping cart!", "success");
    } else {
      showNotification(result.message, "error");
    }
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    showNotification("Removed item from wishlist.", "info");
  };

  return (
    <div className="py-6" id="wishlist-page-container">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Heart className="w-6 h-6 fill-rose-500" />
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Personal Wishlist
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Saved items you intend to purchase later. Your wishlist is saved in your local session.
          </p>
        </div>
        
        <button
          onClick={() => navigate("products")}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-500 text-zinc-950 rounded-xl hover:bg-amber-600 cursor-pointer transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mb-6">
            Explore our massive catalog of electronics, computers, smartphones, fashion wear, books, and home appliances to add favorites!
          </p>
          <button
            onClick={() => navigate("products")}
            className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 hover:from-amber-500 hover:to-amber-600 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Start Browsing Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const hasDiscount = product.discount > 0;
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                id={`wishlist-item-${product.id}`}
              >
                {/* Product Image & Badge */}
                <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => navigate(`product-details?id=${product.id}`)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                      {product.discount}% Off
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-zinc-900/80 text-white text-[10px] font-medium px-2 py-1 rounded-md">
                    {product.brand}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase mb-1 block">
                      {product.category}
                    </span>
                    <h3 
                      onClick={() => navigate(`product-details?id=${product.id}`)}
                      className="text-sm font-bold text-zinc-800 dark:text-zinc-100 line-clamp-2 hover:text-amber-500 transition-colors cursor-pointer mb-2"
                    >
                      {product.name}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-black text-zinc-900 dark:text-zinc-50">
                        ${product.price.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-zinc-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl cursor-pointer transition-colors"
                      title="Add to Shopping Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                    
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
