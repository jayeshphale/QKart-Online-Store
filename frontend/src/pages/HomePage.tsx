/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { products, setSelectedCategory } = useProducts();

  // Get top 4 highly rated products to show as trending
  const trendingProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const categoriesList = [
    { name: "Fruits & Vegetables", image: "https://images.unsplash.com/photo-1610832958506-ee5633619144?w=400&q=80" },
    { name: "Dairy & Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
    { name: "Beverages", image: "https://images.unsplash.com/photo-1527960656366-ee4143dae3d7?w=400&q=80" },
    { name: "Snacks & Branded Foods", image: "https://images.unsplash.com/photo-1599490659223-e1b984c7b2c7?w=400&q=80" },
    { name: "Electronics & Gadgets", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80" }
  ];

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigate("products");
  };

  return (
    <div className="flex flex-col gap-16 pb-16 animate-fadeIn" id="home-page-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-orange-500/10 via-amber-500/5 to-transparent py-16 sm:py-24 rounded-3xl mt-4 px-6 border border-orange-500/5">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full border border-orange-200/40 shadow-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organic & Fresh Supermarket</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
            Freshness Delivered <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Right to Your Door
            </span>
          </h1>
          
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-sm sm:text-base leading-relaxed">
            Browse through QKart’s premium selection of handpicked organic produce, artisanal bakery items, chilled drinks, and trending everyday smart accessories with high-speed delivery.
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center mt-2">
            <button
              onClick={() => {
                setSelectedCategory("All");
                navigate("products");
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer"
              id="hero-shop-now-btn"
            >
              <span>Shop Grocery Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("register")}
              className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm rounded-xl transition-all cursor-pointer border border-transparent dark:border-zinc-800"
            >
              Join QKart Member
            </button>
          </div>
        </div>

        {/* Decorative ambient blobs */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features Portal */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        {[
          { icon: Truck, title: "Free 1-Day Shipping", desc: "No minimum spend required" },
          { icon: ShieldCheck, title: "100% Secure Checkout", desc: "Advanced JWT token security" },
          { icon: RotateCcw, title: "Hassle-Free Returns", desc: "No questions asked policy" },
          { icon: Award, title: "Premium Quality guaranteed", desc: "Directly from organic orchards" }
        ].map((f, i) => {
          const IconComponent = f.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <div className="bg-orange-50 dark:bg-orange-950/20 text-orange-500 p-2.5 rounded-xl shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{f.title}</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Category Slider Portal */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
              Shop by Categories
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Top quality handpicked supermarkets collections
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory("All");
              navigate("products");
            }}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
          >
            See All Categories
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoriesList.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(cat.name)}
              className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 p-3 rounded-2xl shadow-xs hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/40 cursor-pointer text-center flex flex-col items-center gap-3 transition-all duration-300"
              id={`category-item-${i}`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-orange-500 transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products showcase */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
              Trending Grocery & Tech Items
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Highly rated by our organic supermarket members
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory("All");
              navigate("products");
            }}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
          >
            Browse Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={(id) => navigate(`product/${id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
