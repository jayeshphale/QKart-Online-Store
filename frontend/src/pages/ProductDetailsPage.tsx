/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Product } from "../types";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ShoppingCart, Plus, Minus, Heart, Share2, Check, Truck,
  ShieldCheck, Star, MessageSquare, MapPin, RotateCcw, Sparkles,
  Facebook, Twitter, Copy, ExternalLink, ThumbsUp, Layers, Store,
  Tag, Percent, Coins, Calendar, ArrowLeftRight, Handshake, X, ChevronLeft, ChevronRight,
  AlertCircle
} from "lucide-react";

interface ProductDetailsPageProps {
  productId: string;
  navigate: (path: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId, navigate }) => {
  const { products, fetchProductById, error: productContextError } = useProducts();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { showNotification } = useNotification();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  // Primary states
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Gallery & Zoom states
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const mainImgRef = useRef<HTMLImageElement>(null);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [selectedRAM, setSelectedRAM] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  // Delivery states
  const [pincode, setPincode] = useState("");
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);

  // Review states
  const [reviewSort, setReviewSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, number>>({});
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  // FBT and Compare states
  const [fbtItem1, setFbtItem1] = useState(true);
  const [fbtItem2, setFbtItem2] = useState(true);
  const [fbtItem3, setFbtItem3] = useState(true);
  const [isBundling, setIsBundling] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Load product & side-effects
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProductById(productId);
        if (data) {
          setProduct(data);
          setSelectedImage(data.image);
          setQuantity(1);

          // Defaults for variants based on category
          if (data.category === "Mobiles" || data.category === "Laptops") {
            setSelectedColor("Carbon Gray");
            setSelectedStorage("256GB");
            setSelectedRAM("12GB");
            setSelectedModel("Standard Wi-Fi");
          } else {
            setSelectedColor("Classic");
            setSelectedSize("Standard");
          }

          // Persist Recently Viewed Products in localStorage
          const viewedStr = localStorage.getItem("recently_viewed_qkart") || "[]";
          const viewed: string[] = JSON.parse(viewedStr);
          const filtered = [productId, ...viewed.filter(id => id !== productId)].slice(0, 8);
          localStorage.setItem("recently_viewed_qkart", JSON.stringify(filtered));
        }
      } catch (err: any) {
        showNotification(err.message || "Failed to load product", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [productId, fetchProductById]);

  // Handle errors from Context
  useEffect(() => {
    if (productContextError) {
      showNotification(productContextError, "error");
    }
  }, [productContextError]);

  // Dynamic values helper
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const list = [...(product.images || [])];
    if (list.length === 0) list.push(product.image);
    // Fill up to 6 thumbnails
    const stockMocks = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
    ];
    let i = 0;
    while (list.length < 6) {
      const mock = stockMocks[i % stockMocks.length];
      list.push(mock);
      i++;
    }
    return list;
  }, [product]);

  // Pricing based on variants (dynamic simulation)
  const activePrice = useMemo(() => {
    if (!product) return 0;
    let base = product.price;
    if (selectedStorage === "512GB") base += 80;
    if (selectedStorage === "1TB") base += 180;
    if (selectedRAM === "16GB") base += 40;
    if (selectedSize === "Large") base += 10;
    if (selectedModel === "Pro Wi-Fi + Cellular") base += 120;
    return base;
  }, [product, selectedStorage, selectedRAM, selectedSize, selectedModel]);

  const activeOriginalPrice = useMemo(() => {
    if (!product) return 0;
    const ratio = product.originalPrice / product.price;
    return Math.round(activePrice * (ratio > 1 ? ratio : 1.15) * 100) / 100;
  }, [product, activePrice]);

  const activeDiscount = useMemo(() => {
    if (activeOriginalPrice <= activePrice) return 0;
    return Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100);
  }, [activePrice, activeOriginalPrice]);

  const activeSKU = useMemo(() => {
    if (!product) return "";
    const colorTag = selectedColor ? `-${selectedColor.substring(0, 3).toUpperCase()}` : "";
    const storageTag = selectedStorage ? `-${selectedStorage}` : "";
    return `QK-${product.id.toUpperCase()}${colorTag}${storageTag}`;
  }, [product, selectedColor, selectedStorage]);

  // Dynamic Specs
  const specificationsList = useMemo(() => {
    if (!product) return {};
    const base = product.specifications || {};
    if (Object.keys(base).length > 0) return base;
    if (product.category === "Mobiles") {
      return {
        "Brand": product.brand || "Premium",
        "Model": product.name.split("(")[0].trim(),
        "Processor": "Octa-Core Octane Max 2.4GHz",
        "Display": "6.7-inch OLED, 120Hz Fluid",
        "Battery": "5000 mAh Li-Polymer",
        "Operating System": "Android 14 / ProOS",
        "Warranty": "1 Year Brand Warranty"
      };
    }
    return {
      "Brand": product.brand || "Generic Premium",
      "Category": product.category,
      "Materials": "Sustainably Sourced Poly-Alloy",
      "Weight": "450g",
      "Warranty": "1 Year Store Guarantee",
      "Country of Origin": "India"
    };
  }, [product]);

  // Frequently Bought Together items (FBT)
  const fbtItems = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id)
      .slice(0, 2);
  }, [product, products]);

  const fbtTotal = useMemo(() => {
    if (!product) return 0;
    let sum = 0;
    if (fbtItem1) sum += activePrice;
    if (fbtItem2 && fbtItems[0]) sum += fbtItems[0].price;
    if (fbtItem3 && fbtItems[1]) sum += fbtItems[1].price;
    return sum;
  }, [fbtItem1, fbtItem2, fbtItem3, product, activePrice, fbtItems]);

  // Recently Viewed
  const recentlyViewedProducts = useMemo(() => {
    const viewedStr = localStorage.getItem("recently_viewed_qkart") || "[]";
    const viewedIds: string[] = JSON.parse(viewedStr);
    return products.filter(p => viewedIds.includes(p.id) && p.id !== productId).slice(0, 4);
  }, [products, productId]);

  // Reviews & Sort
  const mockReviews = useMemo(() => {
    if (!product) return [];
    const base = [
      { id: "r1", user: "Vikas R.", rating: 5, title: "Mind-blowing product. Truly premium!", text: "Absolutely stunning delivery speed and unmatched material feel. Worth every single penny.", date: "July 08, 2026", verified: true, baseHelpful: 142 },
      { id: "r2", user: "Shalini S.", rating: 4, title: "Great, very functional and sleek", text: "Satisfied with this purchase. The battery and performance indicators are extremely high-quality. Minor scratch on outer package.", date: "July 05, 2026", verified: true, baseHelpful: 56 },
      { id: "r3", user: "Amit K.", rating: 5, title: "Awesome choice, go for it", text: "Using it for over a week now. The smart sensors and display are highly precise. Flipkart-like pricing deal was a steal!", date: "June 29, 2026", verified: true, baseHelpful: 29 },
      { id: "r4", user: "Rohan D.", rating: 1, title: "Extremely disappointed, package arrived scuffed", text: "The product itself seems decent, but delivery service delayed it by 3 days. Also the warranty registration took 40 minutes.", date: "June 15, 2026", verified: false, baseHelpful: 2 }
    ];
    return base.sort((a, b) => {
      if (reviewSort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (reviewSort === "highest") return b.rating - a.rating;
      return a.rating - b.rating;
    });
  }, [product, reviewSort]);

  // Magnifying Zoom Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: "center center", transform: "scale(1)" });
  };

  // Delivery check
  const handlePincodeCheck = () => {
    if (!pincode || pincode.trim().length < 5) {
      showNotification("Please enter a valid 5 or 6 digit ZIP code.", "warning");
      return;
    }
    setIsCheckingDelivery(true);
    setTimeout(() => {
      setIsCheckingDelivery(false);
      setDeliveryResult("Delivery available! Guaranteed standard delivery within 2 days. Express overnight shipping available.");
      showNotification("ZIP Code validated successfully!", "success");
    }, 800);
  };

  // Add to cart helper
  const handleAddToCart = async (qty = quantity) => {
    if (!product) return;
    if (!isAuthenticated) {
      showNotification("Please login first to shop.", "warning");
      navigate("login");
      return;
    }
    setIsAdding(true);
    const mockModifiedProduct = { ...product, price: activePrice, name: `${product.name} (${selectedColor}${selectedStorage ? `, ${selectedStorage}` : ""})` };
    const res = await addToCart(mockModifiedProduct, qty);
    setIsAdding(false);
    if (res.success) {
      showNotification(`Added ${qty} item(s) to your shopping cart!`, "success");
    } else {
      showNotification(res.message || "Failed to add product to cart.", "error");
    }
  };

  // Buy Now helper
  const handleBuyNow = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      showNotification("Please login first to purchase.", "warning");
      navigate("login");
      return;
    }
    setIsBuying(true);
    const mockModifiedProduct = { ...product, price: activePrice, name: `${product.name} (${selectedColor}${selectedStorage ? `, ${selectedStorage}` : ""})` };
    const res = await addToCart(mockModifiedProduct, 1);
    setIsBuying(false);
    if (res.success) {
      navigate("checkout");
    } else {
      showNotification(res.message || "Failed to initiate buy now.", "error");
    }
  };

  // Wishlist toggle
  const handleWishlistToggle = () => {
    if (!product) return;
    const wishlisted = isInWishlist(product.id);
    if (wishlisted) {
      removeFromWishlist(product.id);
      showNotification("Removed item from your wishlist", "info");
    } else {
      addToWishlist(product);
      showNotification("Added item to your wishlist!", "success");
    }
  };

  // FBT Add Bundle to Cart
  const handleAddBundleToCart = async () => {
    if (!isAuthenticated) {
      showNotification("Please login to buy bundle packages.", "warning");
      navigate("login");
      return;
    }
    setIsBundling(true);
    try {
      let added = 0;
      if (fbtItem1 && product) {
        const mockModified = { ...product, price: activePrice, name: `${product.name} (${selectedColor})` };
        await addToCart(mockModified, 1);
        added++;
      }
      if (fbtItem2 && fbtItems[0]) {
        await addToCart(fbtItems[0], 1);
        added++;
      }
      if (fbtItem3 && fbtItems[1]) {
        await addToCart(fbtItems[1], 1);
        added++;
      }
      if (added > 0) {
        showNotification("Successfully added selected items in the bundle package!", "success");
      }
    } catch {
      showNotification("Error during bundle execution.", "error");
    } finally {
      setIsBundling(false);
    }
  };

  // Upvote reviews
  const handleUpvoteReview = (rId: string) => {
    if (votedReviews[rId]) return;
    setVotedReviews(prev => ({ ...prev, [rId]: true }));
    setHelpfulReviews(prev => ({ ...prev, [rId]: (prev[rId] || 0) + 1 }));
    showNotification("Thank you for your valuable feedback!", "success");
  };

  // Share link
  const copyProductLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showNotification("Product link copied to clipboard!", "success");
  };

  const shareSocial = (platform: string) => {
    showNotification(`Sharing product details on ${platform}...`, "info");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse py-6" id="skeleton-container">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 w-1/4 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-6">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 w-3/4 rounded-md" />
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 w-1/3 rounded-md" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 px-4 max-w-lg mx-auto" id="not-found-container">
        <div className="inline-flex p-4 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 mb-4">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">Product Not Found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          The item is either temporarily discontinued, restricted, or incorrect database product keys were queried.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Retry Loading
          </button>
          <button
            onClick={() => navigate("products")}
            className="px-5 py-2.5 border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="flex flex-col gap-8 pb-16" id="premium-product-details">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center flex-wrap gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400" id="breadcrumbs">
        <button onClick={() => navigate("home")} className="hover:text-amber-500 transition-colors">Home</button>
        <span>&gt;</span>
        <button onClick={() => navigate("products")} className="hover:text-amber-500 transition-colors capitalize">{product.category}</button>
        <span>&gt;</span>
        <span className="text-zinc-400 capitalize">Premium Electronics</span>
        <span>&gt;</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product layout block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Media & Gallery */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Thumbnail vertical gallery list */}
            <div className="md:col-span-2 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[460px] pb-2 md:pb-0" id="thumbnail-strip">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setSelectedImage(img)}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 md:w-full aspect-square shrink-0 rounded-xl border-2 p-1 bg-white dark:bg-zinc-900 transition-all cursor-pointer flex items-center justify-center ${
                    selectedImage === img
                      ? "border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                  }`}
                  id={`thumb-${i}`}
                >
                  <img src={img} alt="" className="max-h-full max-w-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>

            {/* Main Interactive Display Viewport with Hover Zoom */}
            <div className="md:col-span-10 flex flex-col gap-2">
              <div
                ref={mainImgRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsLightboxOpen(true)}
                className="relative aspect-square w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 flex items-center justify-center overflow-hidden cursor-zoom-in group shadow-xs"
                id="main-viewport"
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  style={zoomStyle}
                  className="max-h-[92%] max-w-[92%] object-contain transition-transform duration-100 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Badges on main image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  <span className="bg-amber-500 text-zinc-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                    {product.brand}
                  </span>
                  {activeDiscount > 0 && (
                    <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                      {activeDiscount}% OFF
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 bg-zinc-950/60 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3.5 h-3.5" /> Click to expand view
                </div>
              </div>
            </div>

          </div>

          {/* 11. Product Highlights & 12. Detailed About */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/20 space-y-6" id="product-narratives">
            <div>
              <h3 className="text-sm font-black uppercase text-zinc-500 tracking-wider mb-3">Core Product Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Fast Octa-Core Processor & AI Engines</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Premium Materials & Ergo-Shield Frame</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Long-lasting high-density powerpack</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Dust and Water Resistant IP68</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> High definition high color-range screen</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-black uppercase text-zinc-500 tracking-wider mb-3">About This Product</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {product.description}. Designed for high-end consumers seeking a mix of elegant craftsmanship, future-proof features, and robust durability. Fully certified with dynamic power efficiency and intelligent sensor controls. Every module undergoes extensive engineering checks to offer peak consumer output.
              </p>
            </div>
          </div>

          {/* 13. Technical Specifications */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/20" id="tech-specs">
            <h3 className="text-sm font-black uppercase text-zinc-500 tracking-wider mb-4">Complete Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(specificationsList).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-xs font-semibold">
                  <span className="text-zinc-400 capitalize">{key}</span>
                  <span className="text-zinc-800 dark:text-zinc-200 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 18. Frequently Bought Together */}
          {fbtItems.length > 0 && (
            <div className="border border-amber-200 dark:border-amber-900/30 rounded-2xl p-6 bg-gradient-to-br from-amber-500/5 to-transparent space-y-4" id="fbt-bundler">
              <h3 className="text-sm font-black text-amber-800 dark:text-amber-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Frequently Bought Together
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className={`p-2 bg-white dark:bg-zinc-900 border rounded-xl text-center w-28 text-xs font-bold shadow-xs transition-opacity ${fbtItem1 ? "opacity-100" : "opacity-45"}`}>
                    <img src={product.image} alt="" className="w-12 h-12 object-contain mx-auto mb-1" />
                    <p className="truncate text-zinc-700 dark:text-zinc-300">This Item</p>
                    <p className="text-amber-600 dark:text-amber-400 font-extrabold mt-0.5">${activePrice.toFixed(2)}</p>
                  </div>

                  <span className="text-lg font-black text-zinc-400">+</span>

                  {fbtItems[0] && (
                    <div className={`p-2 bg-white dark:bg-zinc-900 border rounded-xl text-center w-28 text-xs font-bold shadow-xs transition-opacity ${fbtItem2 ? "opacity-100" : "opacity-45"}`}>
                      <img src={fbtItems[0].image} alt="" className="w-12 h-12 object-contain mx-auto mb-1" />
                      <p className="truncate text-zinc-700 dark:text-zinc-300">{fbtItems[0].name}</p>
                      <p className="text-amber-600 dark:text-amber-400 font-extrabold mt-0.5">${fbtItems[0].price.toFixed(2)}</p>
                    </div>
                  )}

                  {fbtItems[1] && (
                    <>
                      <span className="text-lg font-black text-zinc-400">+</span>
                      <div className={`p-2 bg-white dark:bg-zinc-900 border rounded-xl text-center w-28 text-xs font-bold shadow-xs transition-opacity ${fbtItem3 ? "opacity-100" : "opacity-45"}`}>
                        <img src={fbtItems[1].image} alt="" className="w-12 h-12 object-contain mx-auto mb-1" />
                        <p className="truncate text-zinc-700 dark:text-zinc-300">{fbtItems[1].name}</p>
                        <p className="text-amber-600 dark:text-amber-400 font-extrabold mt-0.5">${fbtItems[1].price.toFixed(2)}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3 w-full md:max-w-xs border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                  <div className="space-y-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-zinc-600 dark:text-zinc-300">
                      <input type="checkbox" checked={fbtItem1} onChange={e => setFbtItem1(e.target.checked)} className="accent-amber-500 rounded" />
                      <span>{product.name.slice(0, 18)}... (${activePrice})</span>
                    </label>
                    {fbtItems[0] && (
                      <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-zinc-600 dark:text-zinc-300">
                        <input type="checkbox" checked={fbtItem2} onChange={e => setFbtItem2(e.target.checked)} className="accent-amber-500 rounded" />
                        <span>{fbtItems[0].name.slice(0, 18)}... (${fbtItems[0].price})</span>
                      </label>
                    )}
                    {fbtItems[1] && (
                      <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-zinc-600 dark:text-zinc-300">
                        <input type="checkbox" checked={fbtItem3} onChange={e => setFbtItem3(e.target.checked)} className="accent-amber-500 rounded" />
                        <span>{fbtItems[1].name.slice(0, 18)}... (${fbtItems[1].price})</span>
                      </label>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium uppercase tracking-wider">Bundle Total</span>
                      <span className="text-lg font-black text-zinc-900 dark:text-zinc-50">${fbtTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleAddBundleToCart}
                      disabled={isBundling || (!fbtItem1 && !fbtItem2 && !fbtItem3)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-zinc-950 font-black text-xs rounded-xl cursor-pointer shadow-md transition-all shrink-0"
                    >
                      {isBundling ? "Adding Pack..." : "Add Bundle to Cart"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Purchase Buy Box & Variants */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          
          {/* Main Info Block */}
          <div className="space-y-4" id="main-product-meta">
            <div>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[10px] tracking-widest">{product.brand} Prime</span>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mt-1 capitalize">
                {product.name}
              </h1>
              <p className="text-[10px] text-zinc-400 font-bold mt-1">
                Category: <span className="text-zinc-700 dark:text-zinc-300">{product.category}</span> | SKU: <span className="font-mono text-amber-600 dark:text-amber-500">{activeSKU}</span>
              </p>
            </div>

            {/* Star ratings details */}
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 w-fit px-2.5 py-1 rounded-lg">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-3.5 h-3.5 fill-current ${star <= Math.round(product.rating) ? "opacity-100" : "opacity-25"}`} />
                ))}
              </div>
              <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-zinc-400 font-semibold border-l border-zinc-200 dark:border-zinc-800 pl-1.5">
                {product.reviewsCount.toLocaleString()} Customer Ratings
              </span>
            </div>

            {/* Pricing Details */}
            <div className="py-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">${activePrice.toFixed(2)}</span>
                {activeOriginalPrice > activePrice && (
                  <span className="text-sm font-semibold text-zinc-400 line-through">${activeOriginalPrice.toFixed(2)}</span>
                )}
                {activeDiscount > 0 && (
                  <span className="text-xs font-black text-emerald-500">{activeDiscount}% OFF</span>
                )}
              </div>
              <span className="text-[10px] font-bold text-zinc-400 block mt-1">Inclusive of all local and federal taxes</span>
            </div>
          </div>

          {/* 5. Attractive Offers Horizontal Scroll Section */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-500" /> Active Offers Available
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" id="offers-carousel">
              {[
                { title: "Bank Offer", text: "10% Instant Discount on cards", icon: Percent, bg: "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
                { title: "Cashback", text: "Get 5% cashbacks on ICICI Card", icon: Coins, bg: "bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" },
                { title: "No Cost EMI", text: "Interest-free EMIs from $49/mo", icon: Calendar, bg: "bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400" },
                { title: "Exchange", text: "Up to $150.00 off on exchange", icon: ArrowLeftRight, bg: "bg-sky-500/5 border-sky-500/20 text-sky-600 dark:text-sky-400" },
                { title: "Partner Offer", text: "Secure 1-Year Extended Warranty", icon: Handshake, bg: "bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400" }
              ].map((off, i) => (
                <div key={i} className={`p-3 border rounded-xl min-w-[145px] max-w-[145px] text-[10px] font-bold space-y-1 ${off.bg} shrink-0`}>
                  <div className="flex items-center gap-1 font-extrabold uppercase">
                    <off.icon className="w-3.5 h-3.5" /> {off.title}
                  </div>
                  <p className="line-clamp-2 leading-relaxed opacity-95">{off.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Product Variants Selection Cards */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900/10 space-y-4" id="variants-control">
            <h4 className="text-xs font-black uppercase text-zinc-500 tracking-wider">Product Customizations</h4>
            
            {/* Color circles */}
            {selectedColor && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-400 block font-bold">Select Color: <span className="text-zinc-800 dark:text-zinc-200">{selectedColor}</span></span>
                <div className="flex gap-2">
                  {[
                    { name: "Carbon Gray", hex: "bg-zinc-700" },
                    { name: "Polar Silver", hex: "bg-zinc-300" },
                    { name: "Nordic Blue", hex: "bg-blue-600" },
                    { name: "Sunset Gold", hex: "bg-amber-600" }
                  ].map(col => (
                    <button
                      key={col.name}
                      onClick={() => { setSelectedColor(col.name); showNotification(`Selected ${col.name} shade!`, "info"); }}
                      className={`w-7 h-7 rounded-full ${col.hex} cursor-pointer transition-all border-2 relative flex items-center justify-center ${
                        selectedColor === col.name ? "border-amber-500 ring-2 ring-amber-500/20 scale-105" : "border-transparent hover:scale-105"
                      }`}
                    >
                      {selectedColor === col.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage selectors */}
            {(product.category === "Mobiles" || product.category === "Laptops") && selectedStorage && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-400 block font-bold">Select Storage: <span className="text-zinc-800 dark:text-zinc-200">{selectedStorage}</span></span>
                <div className="flex gap-1.5">
                  {["128GB", "256GB", "512GB", "1TB"].map(st => (
                    <button
                      key={st}
                      onClick={() => setSelectedStorage(st)}
                      className={`px-3 py-1.5 border rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                        selectedStorage === st
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RAM selectors */}
            {(product.category === "Mobiles" || product.category === "Laptops") && selectedRAM && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-400 block font-bold">Select Memory RAM: <span className="text-zinc-800 dark:text-zinc-200">{selectedRAM}</span></span>
                <div className="flex gap-1.5">
                  {["8GB", "12GB", "16GB"].map(rm => (
                    <button
                      key={rm}
                      onClick={() => setSelectedRAM(rm)}
                      className={`px-3 py-1.5 border rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                        selectedRAM === rm
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                    >
                      {rm}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes selectors */}
            {product.category !== "Mobiles" && product.category !== "Laptops" && selectedSize && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-400 block font-bold">Select Size Package: <span className="text-zinc-800 dark:text-zinc-200">{selectedSize}</span></span>
                <div className="flex gap-1.5">
                  {["Standard", "Large", "Value Pack"].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 border rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                        selectedSize === sz
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 10. Sticky Buy Box Purchase Panel */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 bg-white dark:bg-zinc-900 shadow-lg space-y-4 relative" id="buy-box">
            
            {/* Stock status indicator */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Availability</span>
              {isOutOfStock ? (
                <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <X className="w-3 h-3" /> Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="bg-amber-500/10 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                  Only {product.stock} left - order soon!
                </span>
              ) : (
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Pin Code / Shipping Estimates */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                <span>Check Shipping & Delivery</span>
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Enter 5-6 digit ZIP Code"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handlePincodeCheck}
                  disabled={isCheckingDelivery}
                  className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs rounded-xl cursor-pointer shadow-sm shrink-0"
                >
                  {isCheckingDelivery ? "Checking..." : "Verify"}
                </button>
              </div>
              {deliveryResult ? (
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-normal">{deliveryResult}</p>
              ) : (
                <div className="space-y-1.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 leading-snug">
                  <p className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-amber-500" /> Free Express Delivery eligible on order above $35</p>
                  <p className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-amber-500" /> Cash on Delivery (COD) / Pay on Delivery available</p>
                  <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> 7 Days Replacement & Full Store Warranty</p>
                </div>
              )}
            </div>

            {/* Qty Selector */}
            {!isOutOfStock && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 p-0.5">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-1 text-zinc-500 hover:text-zinc-950 disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-xs font-black min-w-[30px] text-center">{quantity}</span>
                  <button
                    onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-1 text-zinc-500 hover:text-zinc-950 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart and Buy Now buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleAddToCart()}
                disabled={isAdding || isOutOfStock}
                className="w-full bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 py-3 rounded-xl font-black text-xs cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAdding ? "Adding to Cart..." : (
                  <>
                    <ShoppingCart className="w-4 h-4 shrink-0" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isBuying || isOutOfStock}
                className="w-full bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-black text-xs cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBuying ? "Processing Order..." : "Buy Now"}
              </button>
            </div>

            {/* Mini Actions: Wishlist, Compare, Share */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around gap-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              <button onClick={handleWishlistToggle} className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer">
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-500 text-rose-500 animate-bounce" : ""}`} /> Wishlist
              </button>
              
              <button onClick={() => { setIsCompareModalOpen(true); showNotification("Product loaded into spec comparator!", "success"); }} className="flex items-center gap-1 hover:text-amber-500 transition-colors cursor-pointer">
                <ArrowLeftRight className="w-4 h-4" /> Compare Product
              </button>

              <div className="group relative flex items-center gap-1 hover:text-amber-500 transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" /> Share Product
                
                {/* Micro Share Popover */}
                <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 shadow-xl hidden group-hover:flex flex-col gap-2 z-30 min-w-[120px]">
                  <button onClick={copyProductLink} className="flex items-center gap-1.5 text-[9px] hover:text-amber-500 font-bold py-1">
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </button>
                  <button onClick={() => shareSocial("WhatsApp")} className="flex items-center gap-1.5 text-[9px] hover:text-amber-500 font-bold py-1">
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                  <button onClick={() => shareSocial("Facebook")} className="flex items-center gap-1.5 text-[9px] hover:text-amber-500 font-bold py-1">
                    <Facebook className="w-3.5 h-3.5" /> Facebook
                  </button>
                  <button onClick={() => shareSocial("Twitter")} className="flex items-center gap-1.5 text-[9px] hover:text-amber-500 font-bold py-1">
                    <Twitter className="w-3.5 h-3.5" /> Twitter
                  </button>
                </div>
              </div>
            </div>

            {/* Safe indicators */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[9px] text-zinc-400 font-bold text-center uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure SSL Transaction
            </div>

          </div>

          {/* 20. Seller Information Block */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900/10 space-y-3" id="seller-info">
            <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Merchant Partner Details</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-xs font-black block">SuperGizmos Premium Ltd</span>
                  <span className="text-[10px] text-emerald-500 font-bold">4.8/5 ★ authorized seller badge</span>
                </div>
              </div>
              <span className="text-[9px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md font-bold uppercase">Top Seller</span>
            </div>
          </div>

          {/* 21. Returns & Warranty Cards */}
          <div className="grid grid-cols-3 gap-2 text-center" id="return-warranty-badges">
            {[
              { title: "7 Days Replace", icon: RotateCcw },
              { title: "1 Year Warranty", icon: ShieldCheck },
              { title: "Free Delivery", icon: Truck }
            ].map((bad, i) => (
              <div key={i} className="p-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl space-y-1">
                <bad.icon className="w-4 h-4 mx-auto text-amber-500" />
                <p className="text-[9px] font-black text-zinc-600 dark:text-zinc-300 leading-tight">{bad.title}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 14. Customer Ratings & 15. Rating Distribution */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/10 grid grid-cols-1 md:grid-cols-12 gap-8" id="reviews-section">
        
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-sm font-black uppercase text-zinc-500 tracking-wider">Customer Satisfaction Score</h3>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">{product.rating.toFixed(1)}</span>
            <div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-4 h-4 fill-current ${star <= Math.round(product.rating) ? "opacity-100" : "opacity-25"}`} />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-semibold mt-1 block">Global Verified Rating</span>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-2 pt-4">
            {[
              { star: 5, pct: "74%", count: "9,139" },
              { star: 4, pct: "16%", count: "1,976" },
              { star: 3, pct: "6%", count: "741" },
              { star: 2, pct: "2%", count: "247" },
              { star: 1, pct: "2%", count: "247" }
            ].map((bar, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-bold">
                <span className="w-3 shrink-0">{bar.star}★</span>
                <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: bar.pct }} />
                </div>
                <span className="w-8 text-right text-zinc-400">{bar.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 16. Customer Reviews & Sorting */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-black uppercase text-zinc-500 tracking-wider">Top Verified Customer Reviews</h3>
            
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
              <span>Sort Reviews:</span>
              <select
                value={reviewSort}
                onChange={e => setReviewSort(e.target.value as any)}
                className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-2 py-1 text-xs font-bold text-zinc-700 dark:text-zinc-200 focus:outline-none"
              >
                <option value="newest">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
            {mockReviews.map((rev) => (
              <div key={rev.id} className="p-4 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs uppercase">
                      {rev.user.substring(0, 2)}
                    </div>
                    <div>
                      <span className="text-xs font-black block">{rev.user}</span>
                      <span className="text-[9px] text-zinc-400 font-bold">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3 h-3 fill-current ${star <= rev.rating ? "opacity-100" : "opacity-25"}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-zinc-800 dark:text-zinc-100">{rev.title}</span>
                    {rev.verified && (
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded-md border border-emerald-500/15 uppercase">Verified Purchase</span>
                    )}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{rev.text}</p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/40">
                  <button
                    onClick={() => handleUpvoteReview(rev.id)}
                    disabled={votedReviews[rev.id]}
                    className={`flex items-center gap-1.5 text-[10px] font-bold py-1 px-2.5 rounded-lg border transition-all cursor-pointer ${
                      votedReviews[rev.id]
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{rev.baseHelpful + (helpfulReviews[rev.id] || 0)} helpful votes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 17. Similar Products Slider */}
      {products.filter(p => p.category === product.category && p.id !== product.id).length > 0 && (
        <div className="space-y-4" id="similar-products">
          <h3 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">Customers Who Viewed This Also Bought</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none" id="similar-slider">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 6)
              .map(p => (
                <div key={p.id} className="min-w-[190px] max-w-[190px] p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs shrink-0 flex flex-col justify-between">
                  <div className="relative aspect-square rounded-xl bg-white p-2 mb-2 flex items-center justify-center">
                    <img src={p.image} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                    {p.discount > 0 && <span className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">{p.discount}% OFF</span>}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black truncate text-zinc-800 dark:text-zinc-100">{p.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="text-[10px] font-bold">{p.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm font-black text-zinc-950 dark:text-white">${p.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => { navigate(`product/${p.id}`); window.scrollTo(0, 0); }}
                    className="w-full mt-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 19. Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <div className="space-y-4" id="recently-viewed">
          <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest">Your Recently Viewed Items</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {recentlyViewedProducts.map(p => (
              <div
                key={p.id}
                onClick={() => { navigate(`product/${p.id}`); window.scrollTo(0, 0); }}
                className="min-w-[140px] max-w-[140px] p-2.5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-amber-500 transition-all shrink-0"
              >
                <img src={p.image} alt="" className="w-full aspect-square object-contain p-1 rounded-lg bg-white mb-2" referrerPolicy="no-referrer" />
                <h4 className="text-[10px] font-bold truncate text-zinc-700 dark:text-zinc-200 mb-0.5">{p.name}</h4>
                <p className="text-xs font-black text-amber-600 dark:text-amber-400">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 25. Mobile Sticky Footer (Stick to screen bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800 py-3 px-4 flex items-center justify-between gap-4 z-40 backdrop-blur-md shadow-2xl">
        <button
          onClick={handleWishlistToggle}
          className={`p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 cursor-pointer ${wishlisted ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "text-zinc-500"}`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={() => handleAddToCart()}
          disabled={isAdding || isOutOfStock}
          className="flex-1 bg-gradient-to-b from-amber-400 to-amber-500 text-zinc-950 py-2.5 rounded-xl font-black text-xs cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isAdding ? "Adding..." : "Add to Cart 🛒"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isBuying || isOutOfStock}
          className="flex-1 bg-gradient-to-b from-orange-500 to-orange-600 text-white py-2.5 rounded-xl font-black text-xs cursor-pointer active:scale-95 disabled:opacity-50"
        >
          Buy Now ⚡
        </button>
      </div>

      {/* 2. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-3xl aspect-square flex items-center justify-center p-6">
              <img
                src={selectedImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-4">
              Image view index (Click thumbnail beneath to switch)
            </div>

            <div className="flex gap-2 max-w-md overflow-x-auto pb-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border p-1 bg-zinc-900 transition-all cursor-pointer shrink-0 ${
                    selectedImage === img ? "border-amber-500" : "border-zinc-800"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 24. Compare Products Side-By-Side Drawer/Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-3xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative space-y-6"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-black flex items-center gap-1.5 uppercase text-zinc-800 dark:text-zinc-100">
                  <ArrowLeftRight className="w-5 h-5 text-amber-500" /> Technical Specification Comparison
                </h3>
                <button onClick={() => setIsCompareModalOpen(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="py-2.5 text-zinc-400">Spec Detail</th>
                      <th className="py-2.5 text-amber-600 dark:text-amber-400 font-extrabold">{product.name.slice(0, 20)}... (This Item)</th>
                      <th className="py-2.5 text-zinc-500 font-bold">Standard Store Comparison Baseline</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <td className="py-2 text-zinc-400">Pricing Deal</td>
                      <td className="py-2 font-black text-zinc-800 dark:text-zinc-100">${activePrice}</td>
                      <td className="py-2 text-zinc-500">$299.99 (average)</td>
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800/60">
                      <td className="py-2 text-zinc-400">Rating Grade</td>
                      <td className="py-2 font-bold text-zinc-800 dark:text-zinc-100">{product.rating} / 5 ★</td>
                      <td className="py-2 text-zinc-500">4.1 / 5 ★</td>
                    </tr>
                    {Object.entries(specificationsList).slice(0, 5).map(([key, value]) => (
                      <tr key={key} className="border-b border-zinc-100 dark:border-zinc-800/60">
                        <td className="py-2 text-zinc-400 capitalize">{key}</td>
                        <td className="py-2 font-bold text-zinc-800 dark:text-zinc-100">{value}</td>
                        <td className="py-2 text-zinc-500">Standard Grade Specs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-black text-xs rounded-xl cursor-pointer shadow-sm"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
