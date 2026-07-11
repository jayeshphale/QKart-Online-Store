/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Percent, 
  TrendingUp, 
  Flame, 
  Sparkle,
  ShoppingBag,
  ArrowUp,
  MessageSquare,
  X,
  Send,
  User,
  Check,
  Copy,
  Download,
  Star,
  Tag,
  HelpCircle,
  Mail,
  Smartphone,
  Headphones,
  Shirt,
  Laptop,
  Gamepad2,
  BookOpen,
  Sofa,
  Coffee,
  ShoppingBasket
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { ProductCard } from "../components/ProductCard";
import { useNotification } from "../context/NotificationContext";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../services/api";
import { Product } from "../types";

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { products, setSelectedCategory } = useProducts();
  const { showNotification } = useNotification();

  // 1. Core States
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 19 });
  const [budgetTab, setBudgetTab] = useState<"under10" | "under25" | "under50" | "under100">("under25");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // API Fetched product segment states
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [todayDeals, setTodayDeals] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [budgetProducts, setBudgetProducts] = useState<Product[]>([]);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Floating Chat Box state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    { sender: "bot", text: "Welcome to QKart Support! Ask me anything about coupons, delivery, or refunds.", time: "Just now" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Back to top state
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Recently viewed states
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // 2. Refs for sliders
  const dealsSliderRef = useRef<HTMLDivElement>(null);
  const flashSaleSliderRef = useRef<HTMLDivElement>(null);
  const recentSliderRef = useRef<HTMLDivElement>(null);

  // 3. Carousel data
  const heroSlides = [
    {
      title: "FESTIVAL MEGA SALE IS LIVE",
      subtitle: "Experience jaw-dropping discounts up to 60% off across Mobiles, TVs, and Premium Laptops.",
      category: "All",
      bgColor: "from-amber-600/20 via-orange-500/10 to-transparent border-amber-500/10",
      accentText: "Biggest Festival Celebration",
      actionLabel: "Shop All Deals",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "MEGA ELECTRONICS & AUDIO CARNIVAL",
      subtitle: "Grab AirPods Pro, Sony WH-1000XM5, and premium smart devices with No Cost EMI.",
      category: "Electronics",
      bgColor: "from-blue-600/20 via-sky-500/10 to-transparent border-blue-500/10",
      accentText: "Sound & acoustics drop",
      actionLabel: "Explore Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "SMARTPHONE REVOLUTION LAUNCH",
      subtitle: "Discover Galaxy S24 Ultra & Apple iPhone 15 Pro Max with incredible bank exchange benefits.",
      category: "Mobiles",
      bgColor: "from-purple-600/20 via-indigo-500/10 to-transparent border-purple-500/10",
      accentText: "Exclusive Mobile Launches",
      actionLabel: "Explore Mobiles",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "FASHION WEEK ELEVATION",
      subtitle: "Step into summer with Levi's, Nike, Puma, Zara and more. High contrast styles are in.",
      category: "Fashion",
      bgColor: "from-rose-600/20 via-pink-500/10 to-transparent border-rose-500/10",
      accentText: "Up to 50% Apparel Discount",
      actionLabel: "Explore Fashion",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
    }
  ];

  // Featured Category grid data
  const featuredCats = [
    { name: "Mobiles", icon: <Smartphone className="w-5 h-5" />, bg: "bg-blue-50 dark:bg-blue-950/20", text: "text-blue-500", desc: "Top smart devices", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&auto=format&fit=crop&q=80" },
    { name: "Electronics", icon: <Headphones className="w-5 h-5" />, bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-500", desc: "Sound & acoustics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80" },
    { name: "Fashion", icon: <Shirt className="w-5 h-5" />, bg: "bg-rose-50 dark:bg-rose-950/20", text: "text-rose-500", desc: "Premium summer wear", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop&q=80" },
    { name: "Laptops", icon: <Laptop className="w-5 h-5" />, bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-500", desc: "High-power PCs", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=80" },
    { name: "Gaming", icon: <Gamepad2 className="w-5 h-5" />, bg: "bg-purple-50 dark:bg-purple-950/20", text: "text-purple-500", desc: "Consoles & RGB gear", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80" },
    { name: "Books", icon: <BookOpen className="w-5 h-5" />, bg: "bg-indigo-50 dark:bg-indigo-950/20", text: "text-indigo-500", desc: "Acoustics & novels", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80" },
    { name: "Furniture", icon: <Sofa className="w-5 h-5" />, bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-600", desc: "Ergonomic seating", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&auto=format&fit=crop&q=80" },
    { name: "Kitchen", icon: <Coffee className="w-5 h-5" />, bg: "bg-teal-50 dark:bg-teal-950/20", text: "text-teal-500", desc: "Brews & blenders", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&auto=format&fit=crop&q=80" }
  ];

  // Brand logs images list
  const brandLogos = [
    { 
      name: "Apple", 
      desc: "Premium devices", 
      icon: (
        <svg viewBox="0 0 170 170" className="w-8 h-8 fill-zinc-800 dark:fill-zinc-200 group-hover:fill-zinc-950 dark:group-hover:fill-white transition-colors">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.34-6.15-3.18-2.63-7.04-7.14-11.58-13.56-8.81-12.63-14.88-26.6-18.19-41.9-3.32-15.3-3.6-29.17-.83-41.6 2.76-12.44 8.52-22.36 17.29-29.76 8.77-7.4 18.51-11.16 29.21-11.28 4.92 0 10.51 1.48 16.78 4.43 6.27 2.95 10.15 4.43 11.64 4.43 1.15 0 5.15-1.54 11.98-4.63 6.83-3.08 12.48-4.51 16.96-4.27 15.11.74 26.7 6.17 34.79 16.31-13.14 8.01-19.53 18.9-19.17 32.65.36 10.58 4.16 19.34 11.4 26.29 7.24 6.95 15.82 10.74 25.75 11.37-2.12 6.26-4.64 12.31-7.56 18.15zM119.22 30.74c0-7.89 2.8-15.15 8.41-21.8C133.24 2.29 140.76-.84 150.21.1c.12 1.03.18 1.94.18 2.73 0 7.64-2.83 14.85-8.51 21.65-5.68 6.8-13.23 10.35-22.66 10.65-.12-1.39-.18-2.85-.18-4.39z"/>
        </svg>
      )
    },
    { 
      name: "Samsung", 
      desc: "Smart innovators", 
      icon: (
        <svg viewBox="0 0 100 24" className="w-11 h-11 fill-blue-600 dark:fill-blue-400">
          <path d="M5.4 12.7c-.5-.4-.7-1-.7-1.7V9.7c0-.7.2-1.3.7-1.7.5-.4 1.2-.6 2.1-.6h4.5v2.2H8V11c0 .2.1.4.2.5.1.1.4.2.7.2h1.6c.9 0 1.6.2 2 .6.4.4.6 1 .6 1.7v1.3c0 .7-.2 1.3-.6 1.7-.4.4-1.1.6-2 .6H5.7v-2.2H10v-1.1c0-.2-.1-.4-.2-.5-.1-.1-.4-.2-.7-.2H7.5c-.9 0-1.6-.2-2.1-.6zm14.5-5.3H17l-3.3 11h2.3l.7-2.4h3.6l.7 2.4h2.3l-3.3-11zm-2.8 6.4L18.4 9l1.3 4.8h-2.6zm10.7-6.4v11h2.2V9.8l2.9 6.2 2.9-6.2v8.6H39v-11h-2.1L34 13.5l-2.9-6.1h-2.1zm15.4 5.3c-.5-.4-.7-1-.7-1.7V9.7c0-.7.2-1.3.7-1.7.5-.4 1.2-.6 2.1-.6h4.5v2.2H50V11c0 .2.1.4.2.5.1.1.4.2.7.2h1.6c.9 0 1.6.2 2 .6.4.4.6 1 .6 1.7v1.3c0 .7-.2 1.3-.6 1.7-.4.4-1.1.6-2 .6h-4.8v-2.2h4.3v-1.1c0-.2-.1-.4-.2-.5-.1-.1-.4-.2-.7-.2H49.5c-.9 0-1.6-.2-2.1-.6zm14 5.2V7.4H65v7.3c0 .3.1.5.2.7.1.2.3.2.6.2h2.4c.3 0 .5-.1.6-.2.1-.2.2-.4.2-.7V7.4H71.2v7.7c0 .9-.3 1.6-.8 2.1s-1.3.7-2.4.7h-2.8c-1.1 0-1.9-.2-2.4-.7s-.8-1.2-.8-2.1v-7.7h2.2v7.7c0 .3.1.5.2.7.1.2.3.2.6.2H67.2zm9.1-10.5V18.4H78v-8.3l4.6 8.3H85V7.4h-2.2v8.3l-4.6-8.3h-2.1zm11.7 5.7c0-.9.3-1.6.8-2s1.3-.7 2.4-.7h4v2.2H91v2.1c0 .3.1.5.2.7.1.2.3.2.6.2h2.2v2.2h-3c-1.1 0-1.9-.2-2.4-.7-.5-.4-.8-1.1-.8-2v-2zm1.6-1.1c0-.3-.1-.5-.2-.7-.1-.2-.3-.2-.6-.2h-.8V12h1.6V9.6h-2.4c-.3 0-.5.1-.6.2-.1.2-.2.4-.2.7v.5h3.2v.5z" />
        </svg>
      )
    },
    { 
      name: "Sony", 
      desc: "Ultimate audio", 
      icon: (
        <svg viewBox="0 0 100 24" className="w-11 h-11 fill-zinc-900 dark:fill-zinc-100">
          <path d="M4 6h11v2h-4v8H15v2H4v-2h4V8H4V6zm14.5 0c1.7 0 3 .5 3.9 1.4s1.4 2.2 1.4 3.9v1.4c0 1.7-.5 3-1.4 3.9s-2.2 1.4-3.9 1.4h-2.5V6H18.5zm.5 10c.8 0 1.4-.2 1.8-.7s.6-1.2.6-2.1v-.8c0-.9-.2-1.6-.6-2.1s-1-.7-1.8-.7h-.7V16H19zm14-10l3.5 6.5L40 6h3l-5 9V18h-3v-3l-5-9h3zm8 0h3l4 6.5V6h3v12h-3l-4-6.5V18h-3V6zm14 0h11v2h-4v8h4v2h-11v-2h4V8h-4V6z" />
        </svg>
      )
    },
    { 
      name: "HP", 
      desc: "Compute workstations", 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 fill-blue-600 dark:fill-blue-500">
          <circle cx="50" cy="50" r="46" className="fill-none stroke-blue-600 dark:stroke-blue-500 stroke-[8]" />
          <path d="M42 22h7v19h5l6-13h7v28h-7V35c-1-1.5-3-2.5-5-2.5s-4 1-5 2.5V56h-8V22z M58 44h7v34h-7V59c-1-1.5-3-2.5-5-2.5s-4 1-5 2.5V78h-8V44h8v15l6-15z" className="fill-blue-600 dark:fill-blue-500" />
        </svg>
      )
    },
    { 
      name: "Dell", 
      desc: "Power gaming", 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8">
          <circle cx="50" cy="50" r="45" fill="none" className="stroke-blue-600 dark:stroke-blue-500" strokeWidth="6" />
          <text x="50" y="58" fontSize="24" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1" className="fill-blue-600 dark:fill-blue-500">DELL</text>
        </svg>
      )
    },
    { 
      name: "Lenovo", 
      desc: "Smart laptops", 
      icon: (
        <svg viewBox="0 0 100 24" className="w-11 h-11">
          <text x="50" y="17" fontSize="15" fontWeight="950" fontFamily="sans-serif" textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-200">lenovo</text>
        </svg>
      )
    },
    { 
      name: "Nike", 
      desc: "Active lifestyle", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-zinc-900 dark:fill-zinc-100">
          <path d="M21.1 5.2c-.3 0-.7.1-1.1.3C16 7.5 11.1 10.8 5.6 13.5c-1.8.9-3.7 1.6-5.4 2.1-.4.1-.4.6.1.6 1.8 0 4.1-.6 6.5-1.7 5.6-2.6 10.8-6.1 14.4-8.8.4-.3.4-.6-.1-.5z" />
        </svg>
      )
    },
    { 
      name: "Adidas", 
      desc: "Street design", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-zinc-900 dark:fill-zinc-100">
          <path d="M1 18 L4 18 L10 8 L7 8 Z" />
          <path d="M6 18 L9 18 L16 5 L13 5 Z" />
          <path d="M11 18 L14 18 L21 2 L18 2 Z" />
        </svg>
      )
    },
    { 
      name: "Puma", 
      desc: "Forever faster", 
      icon: (
        <svg viewBox="0 0 100 24" className="w-11 h-11">
          <text x="50" y="17" fontSize="14" fontWeight="950" fontFamily="sans-serif" fontStyle="italic" textAnchor="middle" letterSpacing="1" className="fill-zinc-900 dark:fill-zinc-100">PUMA</text>
        </svg>
      )
    },
    { 
      name: "Boat", 
      desc: "Bass acoustics", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-zinc-900 dark:fill-zinc-100">
          <path d="M12 2 L12 16 L20 16 Z M10 4 L10 16 L3 16 Z M2 18 L22 18 L18 22 L6 22 Z" />
        </svg>
      )
    },
    { 
      name: "JBL", 
      desc: "Party sound", 
      icon: (
        <svg viewBox="0 0 100 24" className="w-11 h-11 fill-orange-600 dark:fill-orange-500">
          <text x="50" y="18" fontSize="16" fontWeight="950" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1" className="fill-orange-600 dark:fill-orange-500">JBL!</text>
        </svg>
      )
    },
    { 
      name: "LG", 
      desc: "Life's good TVs", 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 fill-[#A50034]">
          <circle cx="50" cy="50" r="45" fill="#A50034" />
          <circle cx="38" cy="38" r="5" fill="white" />
          <path d="M 50 30 L 50 50 L 65 50" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 68 32 A 28 28 0 1 0 68 68 L 68 55" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    { 
      name: "OnePlus", 
      desc: "Never settle", 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8">
          <rect x="5" y="5" width="90" height="90" rx="15" fill="#EB0028" />
          <text x="35" y="70" fontSize="55" fontWeight="900" fontFamily="sans-serif" fill="white" textAnchor="middle">1</text>
          <path d="M 65 35 L 85 35 M 75 25 L 75 45" stroke="white" strokeWidth="8" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      name: "ASUS", 
      desc: "Republic of gamers", 
      icon: (
        <svg viewBox="0 0 100 24" className="w-11 h-11 fill-blue-700 dark:fill-blue-400">
          <text x="50" y="17" fontSize="14" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1" className="fill-blue-700 dark:fill-blue-400">ASUS</text>
        </svg>
      )
    }
  ];

  // Coupons listing
  const coupons = [
    { code: "QKART100", save: "Save $5 (₹100)", desc: "On minimum order of $25", offer: "First Order Promo" },
    { code: "ELEC250", save: "Save $12 (₹250)", desc: "On any Laptop or Mobile purchase", offer: "Mega Tech Deal" },
    { code: "SUPER500", save: "Save $25 (₹500)", desc: "On minimum order of $100", offer: "Premium Festival Offer" },
    { code: "AXISBANK10", save: "10% Bank Discount", desc: "On Axis Bank Cards checkout", offer: "Bank Partner Deal" }
  ];

  // Customer Reviews
  const reviews = [
    { name: "Ananya Sharma", rating: 5, comment: "Incredible delivery! Ordered the laptop and it arrived in perfect condition with 1-day delivery. QKart has the best service.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80", location: "New Delhi" },
    { name: "Rohan Das", rating: 5, comment: "Flash Sale prices are unbeatable. Got the Apple series at almost 30% discount compared to other websites. Extremely satisfied!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", location: "Kolkata" },
    { name: "Siddharth Mehta", rating: 4, comment: "The Quick View feature is so convenient! Was able to compare three smartphones and add them to my cart without leaving the list.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", location: "Mumbai" },
    { name: "Priya Nair", rating: 5, comment: "Coupons actually work! Copied the ELEC250 code, applied during checkout and got an instant refund discount on my soundbar.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80", location: "Bengaluru" }
  ];

  // 4. Effects
  // Auto sliding carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Flash sale clock tick
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 59, seconds: 59 }; // Loop sale
      });
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Scroll event for Back To Top Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load recently viewed products
  useEffect(() => {
    const idsString = localStorage.getItem("qkart_recently_viewed");
    if (idsString) {
      try {
        const ids = JSON.parse(idsString) as string[];
        const filtered = products.filter((p) => ids.includes(p.id));
        setRecentlyViewed(filtered.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    } else if (products.length > 0) {
      // Seed default recently viewed
      const defaultViewed = products.slice(2, 6);
      setRecentlyViewed(defaultViewed);
    }
  }, [products]);

  // Fetch home page product segments using backend APIs
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const [bestSellersRes, newArrivalsRes, todayDealsRes, trendingRes, topRatedRes] = await Promise.all([
          api.get("/products/best-sellers?limit=6"),
          api.get("/products/new-arrivals?limit=6"),
          api.get("/products/today-deals?limit=10"),
          api.get("/products/trending?limit=6"),
          api.get("/products/top-rated?limit=6")
        ]);

        setBestSellers(bestSellersRes.data);
        setNewArrivals(newArrivalsRes.data);
        setTodayDeals(todayDealsRes.data);
        setTrendingProducts(trendingRes.data);
        setTopRatedProducts(topRatedRes.data);

        // Filter flashSaleProducts from todayDeals (discount >= 20%)
        const flashSale = todayDealsRes.data.filter((p: Product) => p.discount >= 20);
        setFlashSaleProducts(flashSale);
      } catch (err) {
        console.error("Failed to fetch home page products via APIs:", err);
      }
    };

    fetchHomeProducts();
  }, []);

  // Update budget products whenever products or budgetTab changes
  useEffect(() => {
    if (products && products.length > 0) {
      const budget = products.filter((p) => {
        if (budgetTab === "under10") return p.price <= 10;
        if (budgetTab === "under25") return p.price <= 25;
        if (budgetTab === "under50") return p.price <= 50;
        return p.price <= 100;
      }).slice(0, 4);
      setBudgetProducts(budget);
    }
  }, [products, budgetTab]);

  // 5. Scroll triggers for horizontal lists
  const scrollList = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigate("products");
  };

  // Copy coupon action
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showNotification(`Coupon ${code} copied to clipboard!`, "success");
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  // Newsletter action
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }
    setNewsletterSubscribed(true);
    showNotification("Subscription successful! Welcome to the premium e-commerce club.", "success");
    setNewsletterEmail("");
  };

  // Chatbot logic
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user" as const, text: chatInput.trim(), time: "Just now" };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulate bot reply based on keywords
    setTimeout(() => {
      let botText = "Thank you for reaching out! Our service executives are currently assisting other premium customers. Please let us know how we can help you.";
      const query = userMsg.text.toLowerCase();
      if (query.includes("coupon") || query.includes("discount") || query.includes("save")) {
        botText = "Massive savings are live! You can use coupon ELEC250 to save $12 on Laptops, or QKART100 to save $5 on orders above $25. Enter these in the coupon code field at checkout!";
      } else if (query.includes("wallet") || query.includes("balance") || query.includes("money") || query.includes("add")) {
        botText = "To load mock money into your wallet, click your Wallet Balance inside the header. You can add up to $5000 in virtual credit to purchase premium items!";
      } else if (query.includes("delivery") || query.includes("ship") || query.includes("track")) {
        botText = "We offer Free 1-Day Delivery on QKart Assured products! Check delivery estimates by clicking the location pin drop in the header and entering your pincode.";
      } else if (query.includes("return") || query.includes("refund")) {
        botText = "We offer a hassle-free 10-day return policy! Just navigate to My Orders, select the product, and click Return to request an instant refund.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botText, time: "Just now" }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-12 pb-16 animate-fadeIn text-zinc-900 dark:text-zinc-50" id="home-page-container">
      
      {/* 4. HERO BANNER CAROUSEL (Framer Motion transitions) */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg mt-2 select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={carouselIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-8 sm:px-12 md:px-16 bg-gradient-to-tr ${heroSlides[carouselIndex].bgColor} min-h-[380px]`}
          >
            <div className="flex flex-col items-start gap-4 max-w-xl z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-full uppercase tracking-wider border border-amber-500/20">
                <Sparkle className="w-3.5 h-3.5 fill-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span>{heroSlides[carouselIndex].accentText}</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight leading-none">
                {heroSlides[carouselIndex].title}
              </h1>
              
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md">
                {heroSlides[carouselIndex].subtitle}
              </p>

              <button
                onClick={() => handleCategoryClick(heroSlides[carouselIndex].category)}
                className="mt-2 px-6 py-3 bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-amber-600 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md transform active:scale-95"
              >
                <span>{heroSlides[carouselIndex].actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center max-h-[260px] overflow-hidden rounded-2xl relative">
              <img
                src={heroSlides[carouselIndex].image}
                alt="Promo Banner"
                className="w-full h-full object-cover max-h-[260px] rounded-2xl shadow-md transition-transform duration-500 transform hover:scale-102"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Slide Left/Right Controls */}
        <button
          onClick={() => setCarouselIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 cursor-pointer z-20 flex items-center justify-center transition-all duration-300 shadow-md transform hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCarouselIndex((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 cursor-pointer z-20 flex items-center justify-center transition-all duration-300 shadow-md transform hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                carouselIndex === i ? "bg-amber-500 w-6" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust & Features Rail */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto w-full px-4 sm:px-0">
        {[
          { icon: Truck, title: "Super Fast 1-Day Delivery", desc: "Available to 250+ cities across India", color: "text-emerald-500 bg-emerald-500/10" },
          { icon: ShieldCheck, title: "100% Brand Authenticity", desc: "Direct manufacturer warranties", color: "text-blue-500 bg-blue-500/10" },
          { icon: RotateCcw, title: "Easy 10-Day Returns", desc: "Hassle-free instant refund policy", color: "text-rose-500 bg-rose-500/10" },
          { icon: Award, title: "Assured Quality Guarantee", desc: "Top seller double inspections", color: "text-amber-500 bg-amber-500/10" }
        ].map((f, i) => {
          const IconComponent = f.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-850 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <div className={`${f.color} p-2.5 rounded-xl shrink-0`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-200">{f.title}</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* 5. FEATURED CATEGORIES GRID (Bento layout) */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            Featured Categories
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Handpicked premium selections with massive seasonal pricing drops
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featuredCats.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(cat.name)}
              className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-3xl shadow-sm hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-900/30 cursor-pointer flex flex-col gap-3 transition-all duration-300 relative overflow-hidden h-40"
              id={`featured-cat-card-${i}`}
            >
              {/* Overlay card details */}
              <div className="flex flex-col items-start gap-1 z-10 h-full justify-between">
                <div>
                  <div className={`p-2 rounded-xl ${cat.bg} ${cat.text} w-fit text-lg font-bold flex items-center justify-center`}>
                    <span>{cat.icon}</span>
                  </div>
                  <h4 className="text-sm font-black text-zinc-950 dark:text-zinc-100 mt-2">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-medium leading-tight">
                    {cat.desc}
                  </p>
                </div>
                <button className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5 group-hover:text-amber-600 transition-colors">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Background category image absolute aligned */}
              <div className="absolute right-2 bottom-2 w-24 h-24 overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100/30 flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FLASH SALE SECTION (Countdown Timer & Progress Stock) */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-0">
          <div className="flex flex-col gap-6 bg-red-500/5 border border-red-500/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
              <div className="flex items-center gap-2.5">
                <div className="bg-red-500 text-white p-2.5 rounded-xl shadow-lg shadow-red-500/20">
                  <Flame className="w-5 h-5 fill-white animate-bounce" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight leading-none">
                    Flash Sale Deals!
                  </h2>
                  <p className="text-xs text-red-500 font-extrabold uppercase tracking-widest mt-1">
                    Super Price Cuts &middot; Limited Stock Available
                  </p>
                </div>
              </div>

              {/* Live Countdown Timer */}
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-red-500/15 py-2 px-4 rounded-2xl shadow-sm">
                <Clock className="w-4 h-4 text-red-500 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">Ends In:</span>
                <div className="flex items-center gap-1 font-mono text-xs font-black">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg min-w-[28px] text-center">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-red-500 font-bold">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg min-w-[28px] text-center">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-red-500 font-bold">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-lg min-w-[28px] text-center animate-pulse">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Horizontal Product List with Scroll controls */}
            <div className="relative">
              <div 
                ref={flashSaleSliderRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
              >
                {flashSaleProducts.slice(0, 8).map((p) => {
                  // stock percent calculation
                  const maxStock = p.stock + 12; // simulated original stock
                  const percentLeft = Math.round((p.stock / maxStock) * 100);
                  return (
                    <div key={p.id} className="min-w-[280px] w-[280px] sm:min-w-[310px] sm:w-[310px] snap-start flex flex-col gap-2 bg-white dark:bg-zinc-900/50 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm relative">
                      <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide shadow-md">
                        Limited Time Offer
                      </div>
                      <ProductCard
                        product={p}
                        onViewDetails={(id) => navigate(`product/${id}`)}
                      />
                      
                      {/* Remaining Stock Indicator */}
                      <div className="px-2 pb-2 mt-1">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1">
                          <span>Items Left: {p.stock} units</span>
                          <span className="text-red-500">{percentLeft}% remaining</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percentLeft}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slider Left / Right Triggers */}
              <button
                onClick={() => scrollList(flashSaleSliderRef, "left")}
                className="absolute left-1 top-[40%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-white cursor-pointer z-35 flex items-center justify-center transition-all shadow"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollList(flashSaleSliderRef, "right")}
                className="absolute right-1 top-[40%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-white cursor-pointer z-35 flex items-center justify-center transition-all shadow"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. TODAY'S DEALS SECTION (Horizontal scroll slider) */}
      {todayDeals.length > 0 && (
        <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white leading-none">
                  Today's Deals
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Limited time deals with exclusive price markdowns
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCategoryClick("All")}
                className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline cursor-pointer mr-2"
              >
                See All Deals
              </button>
              <button
                onClick={() => scrollList(dealsSliderRef, "left")}
                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer shadow-sm active:scale-90 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollList(dealsSliderRef, "right")}
                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer shadow-sm active:scale-90 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={dealsSliderRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          >
            {todayDeals.map((p) => (
              <div key={p.id} className="min-w-[260px] w-[260px] sm:min-w-[290px] sm:w-[290px] snap-start relative">
                {p.discount >= 25 && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-zinc-950 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow z-10">
                    Hot Deal
                  </span>
                )}
                <ProductCard
                  product={p}
                  onViewDetails={(id) => navigate(`product/${id}`)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 17. COUPONS SECTION (Interactive Click-to-Copy) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div className="flex flex-col gap-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 rounded-3xl relative overflow-hidden">
          <div className="z-10">
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              Exclusive Discount Coupons
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Click on any coupon code to copy instantly and paste during final checkout for extra discounts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 z-10">
            {coupons.map((cop, idx) => (
              <div 
                key={idx}
                onClick={() => handleCopyCoupon(cop.code)}
                className="bg-white dark:bg-zinc-900 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 transform active:scale-98 group border-dashed"
                id={`coupon-card-${idx}`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-amber-500 font-black uppercase tracking-wider">{cop.offer}</span>
                  <span className="text-sm font-extrabold text-zinc-950 dark:text-zinc-100">{cop.save}</span>
                  <span className="text-[9px] text-zinc-400 leading-tight">{cop.desc}</span>
                </div>
                <div className="flex flex-col items-center justify-center shrink-0 border-l border-zinc-100 dark:border-zinc-800 pl-3">
                  <div className="px-2.5 py-1.5 bg-zinc-950 text-amber-400 dark:text-amber-500 font-mono text-xs font-extrabold rounded-lg tracking-wider border border-zinc-800 flex items-center gap-1 group-hover:bg-zinc-900">
                    <span>{cop.code}</span>
                    {copiedCoupon === cop.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                  </div>
                  <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider mt-1.5">Copy Code</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18. SPECIAL OFFERS (Cashback, Exchange Offer, etc.) */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto w-full px-4 sm:px-0">
        {[
          { title: "No Cost EMI", tag: "Credit Cards", desc: "Up to 12 months interest-free payments", icon: "💳", color: "from-blue-50 to-blue-100/50 dark:from-blue-950/10 dark:to-blue-950/20" },
          { title: "Assured Cashback", tag: "UPI & Wallet", desc: "Get up to $15 cashback on payments", icon: "💰", color: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/10 dark:to-emerald-950/20" },
          { title: "Instant Exchange", tag: "Easy Upgrade", desc: "Exchange old devices for maximum values", icon: "🔄", color: "from-purple-50 to-purple-100/50 dark:from-purple-950/10 dark:to-purple-950/20" },
          { title: "Bank Discounts", tag: "Partner Offers", desc: "Flat 10% off on premium credit cards", icon: "🏦", color: "from-amber-50 to-amber-100/50 dark:from-amber-950/10 dark:to-amber-950/20" },
          { title: "Festival Cashback", tag: "Special Bonus", desc: "Unlock double rewards on summer items", icon: "✨", color: "from-rose-50 to-rose-100/50 dark:from-rose-950/10 dark:to-rose-950/20" }
        ].map((off, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${off.color} border border-zinc-100/50 dark:border-zinc-850 p-4 rounded-2xl shadow-xs flex flex-col gap-1.5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer`}
          >
            <span className="text-2xl">{off.icon}</span>
            <div className="text-[8px] uppercase tracking-widest font-black text-zinc-400 mt-1">{off.tag}</div>
            <h4 className="text-xs font-black text-zinc-950 dark:text-zinc-100">{off.title}</h4>
            <p className="text-[10px] text-zinc-500 leading-snug">{off.desc}</p>
          </div>
        ))}
      </section>

      {/* 16. BUDGET FRIENDLY DEALS (Interactive Tab Filtering) */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0 bg-zinc-50 dark:bg-zinc-900/20 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
              Budget Friendly Deals
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Pocket-friendly products categorized by maximum price boundaries
            </p>
          </div>

          {/* Interactive Pricing Tabs */}
          <div className="flex gap-2 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-fit">
            {[
              { id: "under10", label: "Under $10 (₹499)" },
              { id: "under25", label: "Under $25 (₹999)" },
              { id: "under50", label: "Under $50 (₹1999)" },
              { id: "under100", label: "Under $100 (₹4999)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBudgetTab(tab.id as any)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  budgetTab === tab.id 
                    ? "bg-amber-500 text-zinc-950 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {budgetProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={(id) => navigate(`product/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl gap-2">
            <ShoppingBasket className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
            <h4 className="text-sm font-bold text-zinc-500">No active deals found</h4>
            <p className="text-[10px] text-zinc-400">Try switching to a higher budget range category</p>
          </div>
        )}
      </section>

      {/* 7. BEST SELLERS SECTION */}
      {bestSellers.length > 0 && (
        <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white leading-none">
                  Best Sellers
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Our top trending marketplace products by high review volumes
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCategoryClick("All")}
              className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline cursor-pointer"
            >
              See All Best Sellers
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((p, idx) => (
              <div key={p.id} className="relative group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden p-1 shadow-xs transition-transform duration-300">
                {/* Ranking Ribbon */}
                <div className="absolute top-4 left-4 z-10 bg-amber-500 text-zinc-950 text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-900">
                  #{idx + 1}
                </div>
                <div className="absolute top-4 right-14 z-10 flex gap-1">
                  <span className="bg-zinc-950 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                    Favorite
                  </span>
                  <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                    <Star className="w-2 h-2 fill-white text-white" /> Top Rated
                  </span>
                </div>
                <ProductCard
                  product={p}
                  onViewDetails={(id) => navigate(`product/${id}`)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 12. FEATURED PRODUCTS (Premium full width layouts) */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            Premium Featured Showcases
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Explore premium flagship launches from top certified manufacturers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flagship Product Showcase 1 */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-8 rounded-3xl border border-zinc-850 flex flex-col justify-between gap-8 min-h-[340px] relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-colors duration-500" />
            <div className="flex flex-col gap-3 max-w-sm z-10">
              <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Premium Flagship Design
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                The All-New Samsung Galaxy S24 Ultra
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Empowered with advanced Galaxy AI, Snapdragon 8 Gen 3, and a cinematic Quad HD+ display. Order now and get Free Galaxy Buds Pro!
              </p>
            </div>
            <div className="flex items-center gap-4 z-10 flex-wrap">
              <span className="text-lg font-black text-white">$1,199.99</span>
              <span className="text-zinc-500 text-xs line-through">$1,399.99</span>
              <button 
                onClick={() => handleCategoryClick("Mobiles")}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
              >
                <span>View Flagships</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Flagship Product Showcase 2 */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-8 rounded-3xl border border-zinc-850 flex flex-col justify-between gap-8 min-h-[340px] relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-colors duration-500" />
            <div className="flex flex-col gap-3 max-w-sm z-10">
              <span className="text-[10px] uppercase font-black text-blue-400 tracking-widest flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Acoustic Acoustics Excellence
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Sony WH-1000XM5 Noise Cancelling
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Industry-leading noise cancellation, breathtaking high-resolution sound, and crystal-clear hands-free calling. Up to 30-hour battery life.
              </p>
            </div>
            <div className="flex items-center gap-4 z-10 flex-wrap">
              <span className="text-lg font-black text-white">$349.99</span>
              <span className="text-zinc-500 text-xs line-through">$399.99</span>
              <button 
                onClick={() => handleCategoryClick("Electronics")}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
              >
                <span>View Headsets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRENDING PRODUCTS GRID */}
      {trendingProducts.length > 0 && (
        <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white leading-none">
                  Trending Products
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Highly sought products with rapid sales velocity
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCategoryClick("All")}
              className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline cursor-pointer"
            >
              See All Trending
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={(id) => navigate(`product/${id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 13. SHOP BY CATEGORY (Aesthetic Large Cards) */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            Shop by Category
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Bespoke collection cards categorized for modern lifestyles
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Electronics", tag: "Audio & Accessories", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80" },
            { name: "Fashion", tag: "Apparel & Shoes", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&auto=format&fit=crop&q=80" },
            { name: "Laptops", tag: "Workstations & PCs", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80" },
            { name: "Gaming", tag: "RGB & Consoles", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80" }
          ].map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-zinc-100 dark:border-zinc-850"
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400">{cat.tag}</span>
                <h4 className="text-base font-black text-white">{cat.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white leading-none">
                  New Arrivals
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Brand new releases and newly cataloged items
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCategoryClick("All")}
              className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline cursor-pointer"
            >
              See All New Additions
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((p) => (
              <div key={p.id} className="relative">
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow z-10 animate-pulse">
                  NEW
                </span>
                <ProductCard
                  product={p}
                  onViewDetails={(id) => navigate(`product/${id}`)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. TOP BRANDS SECTION (Logo tickers with hover animation) */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            Top Partner Brands
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Directly certified manufacturer relationships for maximum warranty and trust
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {brandLogos.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => { setSelectedCategory("All"); navigate("products"); }}
              className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-900/40 cursor-pointer transition-all duration-300"
              id={`brand-partner-item-${idx}`}
            >
              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800/80 group-hover:scale-105 group-hover:border-amber-500/40 group-hover:shadow-md group-hover:shadow-amber-500/5 transition-all duration-300 p-2 shrink-0">
                {brand.icon}
              </div>
              <div>
                <span className="text-xs font-black text-zinc-950 dark:text-zinc-100 group-hover:text-amber-500 transition-colors block">
                  {brand.name}
                </span>
                <span className="text-[8px] text-zinc-400 font-medium block mt-0.5 leading-none">
                  {brand.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 14. RECOMMENDED PRODUCTS & 15. TOP RATED PRODUCTS (Tabs combined) */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0 bg-amber-500/5 dark:bg-zinc-900/10 border border-amber-500/10 p-6 rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Col 1: Recommended Products */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-black text-zinc-950 dark:text-white flex items-center gap-1.5">
                <Award className="text-amber-500 w-5 h-5" /> Recommended For You
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Based on popular catalog matches and top views</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(3, 7).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewDetails={(id) => navigate(`product/${id}`)}
                />
              ))}
            </div>
          </div>

          {/* Col 2: Top Rated Products */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-black text-zinc-950 dark:text-white flex items-center gap-1.5">
                <Star className="text-amber-500 fill-amber-500 w-5 h-5" /> Top Rated Products
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Only highly reviewed items with 4.5+ star ratings</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topRatedProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="relative">
                  <span className="absolute top-4 left-4 bg-amber-500 text-zinc-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-zinc-950 text-zinc-950" /> 5-Star Class
                  </span>
                  <ProductCard
                    product={p}
                    onViewDetails={(id) => navigate(`product/${id}`)}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 19. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewed.length > 0 && (
        <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
          <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white leading-none">
                  Recently Viewed Products
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Pick up right where you left off on items you viewed
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => scrollList(recentSliderRef, "left")}
                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer shadow-sm active:scale-90 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollList(recentSliderRef, "right")}
                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer shadow-sm active:scale-90 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={recentSliderRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          >
            {recentlyViewed.map((p) => (
              <div key={p.id} className="min-w-[240px] w-[240px] sm:min-w-[270px] sm:w-[270px] snap-start">
                <ProductCard
                  product={p}
                  onViewDetails={(id) => navigate(`product/${id}`)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 20. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            Customer Testimonials
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Check real-world satisfaction reviews from verified buyers across major cities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-850 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between gap-4 h-56"
              id={`customer-testimonial-${i}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, rIdx) => (
                    <Star key={rIdx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed overflow-hidden text-ellipsis display-box-vertical-clamp" style={{ WebkitLineClamp: 4, display: "-webkit-box", WebkitBoxOrient: "vertical", height: "4.8rem" }}>
                  "{rev.comment}"
                </p>
              </div>

              {/* User details footer */}
              <div className="flex items-center gap-3 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-9 h-9 rounded-full object-cover shadow border border-zinc-200 dark:border-zinc-800"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-black text-zinc-950 dark:text-zinc-200">{rev.name}</span>
                  <span className="text-[10px] text-zinc-400 font-bold">{rev.location} &middot; Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 21. NEWSLETTER & 22. DOWNLOAD APP SECTIONS (Side by side) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full px-4 sm:px-0">
        
        {/* Newsletter Subscription Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-8 rounded-3xl border border-zinc-850 flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="flex flex-col gap-2 z-10">
            <span className="text-[9px] uppercase font-black text-amber-400 tracking-widest flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Newsletter subscription
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight leading-none mt-1">
              Join QKart Prime Member Club
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              Subscribe to unlock early access flash sale alerts, copyable bank promo codes, and up to $50 worth of coupon discount bundles directly in your inbox!
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-2.5 z-10 w-full mt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-xs bg-zinc-900 border border-zinc-800 rounded-xl outline-none text-white focus:border-amber-500"
              required
              disabled={newsletterSubscribed}
            />
            <button
              type="submit"
              disabled={newsletterSubscribed}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-emerald-500 disabled:text-white text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-500/10 shrink-0"
            >
              {newsletterSubscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <span>Subscribe Club</span>
              )}
            </button>
          </form>
        </div>

        {/* Download App Promo Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-8 rounded-3xl border border-zinc-850 flex flex-col sm:flex-row justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="flex flex-col gap-3 max-w-sm justify-between z-10">
            <div>
              <span className="text-[9px] uppercase font-black text-blue-400 tracking-widest flex items-center gap-1">
                <Download className="w-3.5 h-3.5 animate-bounce" /> Mobile App Launched
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight leading-none mt-1">
                Download the QKart App
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed mt-2">
                Scan the QR code or click store badges to download the premium marketplace app. Track live deliveries, receive push deal alerts, and check out in under 10 seconds!
              </p>
            </div>
            
            {/* Store Badges */}
            <div className="flex items-center gap-2.5 flex-wrap mt-2">
              <a href="#" onClick={(e) => e.preventDefault()} className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-zinc-200">
                  <path d="M3.609 1.814L13.783 12 3.609 22.186c-.347.347-.609.183-.609-.311V2.125c0-.494.262-.658.609-.311zm11.23 9.141l2.42-1.42a1.05 1.05 0 0 1 1.052 0l2.421 1.42c.441.259.441.678 0 .937l-2.421 1.42a1.05 1.05 0 0 1-1.052 0l-2.42-1.42c-.441-.259-.441-.678 0-.937zm-.26 1.982L15.39 12.33c-.347-.347-.347-.913 0-1.26l.812-.609c.347-.347.913-.347 1.26 0l1.42 1.42a.89.89 0 0 1 0 1.26l-1.42 1.42c-.347.347-.913.347-1.26 0l-.812-.609z" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[8px] text-zinc-500 font-bold">GET IT ON</span>
                  <span className="text-[10px] font-black text-zinc-100">Google Play</span>
                </div>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all">
                <svg viewBox="0 0 170 170" className="w-4 h-4 fill-zinc-200">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.34-6.15-3.18-2.63-7.04-7.14-11.58-13.56-8.81-12.63-14.88-26.6-18.19-41.9-3.32-15.3-3.6-29.17-.83-41.6 2.76-12.44 8.52-22.36 17.29-29.76 8.77-7.4 18.51-11.16 29.21-11.28 4.92 0 10.51 1.48 16.78 4.43 6.27 2.95 10.15 4.43 11.64 4.43 1.15 0 5.15-1.54 11.98-4.63 6.83-3.08 12.48-4.51 16.96-4.27 15.11.74 26.7 6.17 34.79 16.31-13.14 8.01-19.53 18.9-19.17 32.65.36 10.58 4.16 19.34 11.4 26.29 7.24 6.95 15.82 10.74 25.75 11.37-2.12 6.26-4.64 12.31-7.56 18.15zM119.22 30.74c0-7.89 2.8-15.15 8.41-21.8C133.24 2.29 140.76-.84 150.21.1c.12 1.03.18 1.94.18 2.73 0 7.64-2.83 14.85-8.51 21.65-5.68 6.8-13.23 10.35-22.66 10.65-.12-1.39-.18-2.85-.18-4.39z"/>
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[8px] text-zinc-500 font-bold">Download on</span>
                  <span className="text-[10px] font-black text-zinc-100">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Simulated QR Code scan box */}
          <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl w-36 shrink-0 mx-auto sm:mx-0 z-10 shadow-lg">
            {/* Elegant visual QR Mockup */}
            <div className="w-24 h-24 bg-white p-1 rounded-lg flex flex-col gap-1 overflow-hidden relative group">
              <div className="grid grid-cols-5 gap-1 h-full w-full">
                {Array.from({ length: 25 }).map((_, qIdx) => {
                  const isBlack = (qIdx % 2 === 0 && qIdx % 3 !== 0) || qIdx === 0 || qIdx === 4 || qIdx === 20 || qIdx === 24;
                  return (
                    <div 
                      key={qIdx} 
                      className={`rounded-xs ${isBlack ? "bg-zinc-950" : "bg-transparent"}`}
                    />
                  );
                })}
              </div>
              <div className="absolute inset-x-0 h-0.5 bg-amber-500 animate-bounce top-1/2" />
            </div>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-3">Scan to Install</span>
          </div>

        </div>

      </section>

      {/* Floating Customer Support Chat Box Drawer (MUI Rounded cards & soft shadows) */}
      <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end gap-3 select-none">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl shadow-2xl w-[320px] sm:w-[350px] overflow-hidden flex flex-col"
              id="customer-chat-container"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-950 text-amber-400 flex items-center justify-center text-xs font-black animate-pulse">
                    QK
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black">QKart Assistant</span>
                    <span className="text-[9px] font-bold opacity-80 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Online &middot; Instant answers
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-full text-zinc-950 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="p-4 flex flex-col gap-3 max-h-[260px] overflow-y-auto min-h-[220px]">
                {chatMessages.map((msg, mIdx) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <div 
                      key={mIdx} 
                      className={`flex flex-col max-w-[80%] ${isBot ? "self-start items-start" : "self-end items-end"}`}
                    >
                      <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                        isBot 
                          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-tl-none" 
                          : "bg-amber-500 text-zinc-950 font-medium rounded-tr-none"
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-zinc-400 font-medium mt-1 px-1">
                        {isBot ? "QKart Bot" : "You"} &middot; {msg.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 border-t border-zinc-100 dark:border-zinc-900">
                {[
                  "Active coupons?",
                  "Add funds info",
                  "1-Day Delivery"
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => { setChatInput(prompt); }}
                    className="text-[9px] font-bold bg-zinc-50 dark:bg-zinc-900 hover:bg-amber-500/10 hover:text-amber-500 dark:hover:bg-amber-500/10 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-lg px-2 py-1 transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-zinc-100 dark:border-zinc-900 flex gap-2 bg-zinc-50 dark:bg-zinc-900/40">
                <input
                  type="text"
                  placeholder="Ask about coupons, delivery, returns..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-800 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="p-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl flex items-center justify-center shadow cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Icon */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-zinc-950 shadow-2xl flex items-center justify-center cursor-pointer hover:opacity-90 transform hover:scale-105 active:scale-95 transition-all relative border border-amber-500/10"
          title="Open QKart Virtual Helpdesk"
          id="chat-toggle-floating-btn"
        >
          {chatOpen ? <X className="w-5 h-5 animate-pulse" /> : <MessageSquare className="w-5 h-5" />}
          {!chatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce border border-zinc-900">
              1
            </span>
          )}
        </button>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-45 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xl flex items-center justify-center cursor-pointer transition-all transform active:scale-90"
            title="Scroll back to top of page"
            id="back-to-top-floating-btn"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};
