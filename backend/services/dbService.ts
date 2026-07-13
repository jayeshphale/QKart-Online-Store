/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import { DB_FILE_PATH } from "../config/config";
import { Product, CartItem, Order } from "../types";
import { generateMockDatabase } from "./dataGenerator";

export interface DatabaseSchema {
  users: Record<string, { username: string; passwordHash: string; walletBalance: number; addresses: string[] }>;
  carts: Record<string, CartItem[]>;
  orders: Record<string, Order[]>;
  products: Product[];
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Samsung Galaxy S24 Ultra (512GB, Titanium Black)",
    category: "Mobiles",
    price: 1199.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    description: "Experience the ultimate smartphone power with Galaxy AI, featuring a titanium frame, 200MP camera, Snapdragon 8 Gen 3, and integrated S-Pen.",
    stock: 25,
    brand: "Samsung",
    originalPrice: 1299.99,
    discount: 8,
    reviewsCount: 1240,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "RAM": "12GB LPDDR5X",
      "Storage": "512GB UFS 4.0",
      "Battery": "5000mAh with 45W Fast Charge"
    },
    deliveryInfo: "FREE Delivery by Tomorrow. Order within 2 hrs."
  },
  {
    id: "prod-2",
    name: "Apple MacBook Air M3 (13-inch, 16GB RAM, 512GB SSD)",
    category: "Laptops",
    price: 1299.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    description: "Strikingly thin design. Fast and power-efficient M3 chip to breeze through work, play, and intensive multitasking with up to 18 hours battery life.",
    stock: 15,
    brand: "Apple",
    originalPrice: 1499.00,
    discount: 13,
    reviewsCount: 852,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Chip": "Apple M3 Chip (8-core CPU, 10-core GPU)",
      "Memory": "16GB Unified RAM",
      "Storage": "512GB Superfast SSD",
      "Battery Life": "Up to 18 hours",
      "Weight": "2.7 pounds (1.24 kg)"
    },
    deliveryInfo: "FREE Delivery by Sunday. Expedited available."
  },
  {
    id: "prod-3",
    name: "Dell XPS 13 Plus Premium Touch Laptop",
    category: "Laptops",
    price: 1449.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    description: "The most powerful 13-inch XPS laptop is twice as performant as before in the same size. Features seamless glass touchpad and capacitive touch function row.",
    stock: 10,
    brand: "Dell",
    originalPrice: 1699.99,
    discount: 15,
    reviewsCount: 310,
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Processor": "Intel Core i7-1360P (12 Cores, up to 5.0GHz)",
      "Display": "13.4-inch FHD+ InfinityEdge Touch, 500 nits",
      "RAM": "16GB LPDDR5 Dual Channel",
      "Storage": "1TB M.2 PCIe NVMe SSD",
      "OS": "Windows 11 Home"
    },
    deliveryInfo: "FREE Delivery by Monday. No extra cost."
  },
  {
    id: "prod-4",
    name: "Sony WH-1000XM5 Noise Canceling Headphones",
    category: "Electronics",
    price: 348.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Two processors control 8 microphones for unprecedented noise cancellation. Auto NC Optimizer customizes noise canceling based on your environment.",
    stock: 45,
    brand: "Sony",
    originalPrice: 399.99,
    discount: 13,
    reviewsCount: 2315,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Battery Life": "Up to 30 hours playback",
      "Bluetooth": "v5.2 Multi-point connection",
      "Microphones": "8 Mics with precise voice pickup",
      "Controls": "Touch gestures on ear cups",
      "Charging": "Quick charge 3 min for 3 hours"
    },
    deliveryInfo: "FREE Delivery by Tomorrow. Fast shipping."
  },
  {
    id: "prod-5",
    name: "LG C3 Series 65-Inch Class OLED evo Smart TV",
    category: "TVs",
    price: 1596.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
    description: "Experience infinite contrast, deep blacks, and spectacular color. Powered by the a9 AI Processor Gen6 for exceptional sound and picture tailoring.",
    stock: 8,
    brand: "LG",
    originalPrice: 1999.99,
    discount: 20,
    reviewsCount: 654,
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Display Tech": "OLED evo, Infinite Contrast",
      "Refresh Rate": "120Hz Native, VRR, G-Sync",
      "Processor": "a9 AI Processor Gen6 4K",
      "HDR": "Dolby Vision, HDR10, HLG",
      "Audio": "9.1.2 Virtual Surround Sound"
    },
    deliveryInfo: "Scheduled FREE Delivery & Installation available."
  },
  {
    id: "prod-6",
    name: "Dyson V15 Detect Cordless Vacuum Cleaner",
    category: "Home Appliances",
    price: 649.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    description: "The most powerful, intelligent cordless vacuum. Laser reveals microscopic dust, automatically adapting suction power based on floor types.",
    stock: 12,
    brand: "Dyson",
    originalPrice: 749.99,
    discount: 13,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Run Time": "Up to 60 minutes",
      "Suction Power": "240 AW",
      "Weight": "6.8 lbs",
      "Bin Volume": "0.2 gallons",
      "Filtration": "99.99% efficient HEPA filtration"
    },
    deliveryInfo: "FREE Delivery by Monday. Ships from warehouse."
  },
  {
    id: "prod-7",
    name: "Levi's Classic Sherpa Denim Jacket",
    category: "Fashion",
    price: 79.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    description: "The original denim jacket since 1967, featuring warm, fuzzy sherpa lining and collar, button cuffs, and dual chest pockets.",
    stock: 50,
    brand: "Levi's",
    originalPrice: 108.00,
    discount: 26,
    reviewsCount: 1450,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Material": "100% Cotton Outer, Polyester Sherpa Lining",
      "Fit": "Regular / Standard fit",
      "Closure": "Button placket",
      "Pockets": "2 chest pockets, 2 side welt pockets",
      "Care": "Machine wash cold inside out"
    },
    deliveryInfo: "FREE Delivery by Sunday. Eligible for Prime."
  },
  {
    id: "prod-8",
    name: "Nike Air Max 270 Running Shoes",
    category: "Shoes",
    price: 139.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Nike's first lifestyle Air Max delivers style, comfort, and attitude. A large Max Air unit in the heel gives responsive, lightweight bounce.",
    stock: 30,
    brand: "Nike",
    originalPrice: 160.00,
    discount: 12,
    reviewsCount: 3120,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Type": "Running / Lifestyle Sneakers",
      "Sole": "Premium Rubber Sole",
      "Upper": "Breathable Woven Knit Mesh",
      "Cushioning": "270 Max Air Heel Unit",
      "Weight": "11.4 oz (Men's Size 9)"
    },
    deliveryInfo: "FREE Delivery by Saturday. Hassle-free returns."
  },
  {
    id: "prod-9",
    name: "Apple Watch Series 9 GPS 45mm",
    category: "Watches",
    price: 359.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    description: "S9 SiP enables a super-bright display and a magical new way to interact without touching the screen. Advanced health, safety, and activity tracking.",
    stock: 20,
    brand: "Apple",
    originalPrice: 429.00,
    discount: 16,
    reviewsCount: 945,
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Display": "Always-On Retina display, up to 2000 nits",
      "Processor": "S9 SiP with 64-bit dual-core processor",
      "Sensors": "Blood Oxygen, ECG, Temperature, Fall Detection",
      "Water Resistance": "Swimproof to 50m (WR50)",
      "Battery Life": "Up to 18 hours (36 hrs in low power)"
    },
    deliveryInfo: "FREE Delivery by Tomorrow. Order within 1 hr."
  },
  {
    id: "prod-10",
    name: "Atomic Habits by James Clear (Hardcover)",
    category: "Books",
    price: 15.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    description: "An easy & proven way to build good habits & break bad ones. James Clear, one of the world's leading experts on habit formation, reveals practical strategies.",
    stock: 100,
    brand: "Penguin Random House",
    originalPrice: 27.00,
    discount: 40,
    reviewsCount: 45210,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Author": "James Clear",
      "Publisher": "Avery; Hardcover edition",
      "Pages": "320 pages",
      "Language": "English",
      "Dimensions": "6 x 1.1 x 9 inches"
    },
    deliveryInfo: "FREE Delivery by Saturday with standard shipping."
  },
  {
    id: "prod-11",
    name: "Steelcase Gesture Ergonomic Office Chair",
    category: "Furniture",
    price: 1199.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80",
    description: "Designed to support our interactions with today's technologies. Core Equalizer automatically adjusts to provide optimum lumbar support in any position.",
    stock: 15,
    brand: "Steelcase",
    originalPrice: 1399.99,
    discount: 14,
    reviewsCount: 412,
    images: [
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Armrest": "360-degree fully adjustable arms",
      "Seat Depth": "Adjustable active seat slider",
      "Weight Capacity": "Up to 400 pounds",
      "Materials": "Premium high-durability woven upholstery",
      "Warranty": "12-Year manufacturer warranty"
    },
    deliveryInfo: "FREE Scheduled White Glove Delivery."
  },
  {
    id: "prod-12",
    name: "Keurig K-Elite Single Serve Coffee Maker",
    category: "Kitchen",
    price: 139.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop&q=80",
    description: "Combines a premium brushed finish and programmable features to deliver both modern design and the ultimate in beverage customization.",
    stock: 35,
    brand: "Keurig",
    originalPrice: 189.99,
    discount: 26,
    reviewsCount: 1542,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Water Reservoir": "75 oz removable tank",
      "Brew Sizes": "4, 6, 8, 10, 12 oz K-cup sizes",
      "Special Button": "Strong Brew & Iced Coffee settings",
      "Temperature": "Adjustable between 187° and 192°",
      "Material": "Brushed Slate Stainless Steel"
    },
    deliveryInfo: "FREE Delivery by Sunday. Eligible for Prime."
  },
  {
    id: "prod-13",
    name: "LEGO Star Wars Millennium Falcon Model Building Kit",
    category: "Toys",
    price: 149.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1585366119957-e5733be3c794?w=600&auto=format&fit=crop&q=80",
    description: "Build a highly detailed LEGO model of the iconic Millennium Falcon from Star Wars. Features rotating top/bottom gun turrets, 2 spring-loaded shooters.",
    stock: 25,
    brand: "LEGO",
    originalPrice: 169.99,
    discount: 11,
    reviewsCount: 2050,
    images: [
      "https://images.unsplash.com/photo-1585366119957-e5733be3c794?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Model Number": "75257",
      "Piece Count": "1,351 pieces",
      "Minifigures": "7 characters (Finn, Chewbacca, C-3PO, etc.)",
      "Age Range": "9 years and up",
      "Dimensions": "5” H x 17” L x 12” W"
    },
    deliveryInfo: "FREE Delivery by Saturday. Perfect gift option."
  },
  {
    id: "prod-14",
    name: "PlayStation 5 Console (Slim OLED Edition)",
    category: "Gaming",
    price: 449.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
    stock: 15,
    brand: "Sony",
    originalPrice: 499.00,
    discount: 10,
    reviewsCount: 1870,
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Storage": "1TB Custom High-Speed NVMe SSD",
      "Optical Drive": "Ultra HD Blu-ray disc drive",
      "Resolution": "Support for 4K 120Hz, 8K, HDR",
      "Controller": "DualSense Wireless Controller with Haptics",
      "Audio Tech": "Tempest 3D AudioTech"
    },
    deliveryInfo: "FREE Delivery by Tomorrow. Order within 1 hr."
  },
  {
    id: "prod-15",
    name: "Anker Prime 20000mAh Power Bank (200W)",
    category: "Accessories",
    price: 99.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop&q=80",
    description: "Ultra-high capacity power bank with 200W total output, multi-device fast charging, and a beautiful digital display indicating power flow.",
    stock: 60,
    brand: "Anker",
    originalPrice: 129.99,
    discount: 23,
    reviewsCount: 780,
    images: [
      "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop&q=80"
    ],
    specifications: {
      "Capacity": "20,000mAh Lithium-Ion",
      "Max Output": "200W total (up to 100W per USB-C port)",
      "Ports": "2x USB-C, 1x USB-A",
      "Recharge Speed": "100W full recharge in 1.1 hours",
      "Display": "Smart digital battery health display"
    },
    deliveryInfo: "FREE Delivery by Tomorrow. Fast shipping."
  },
  {
    id: "prod-16",
    name: "Dior Sauvage Eau de Parfum (3.4 oz)",
    category: "Beauty",
    price: 145.00,
    rating: 4.7,
    image: "https://picsum.photos/seed/sauvage/600/600",
    description: "The juicy freshness of Calabrian bergamot combines with the woody mystery of Papua New Guinean vanilla absolute. Powerful and noble scent.",
    stock: 30,
    brand: "Dior",
    originalPrice: 160.00,
    discount: 9,
    reviewsCount: 1540,
    images: [
      "https://picsum.photos/seed/sauvage/600/600"
    ],
    specifications: {
      "Scent Type": "Warm, Citrusy & Woody",
      "Fragrance Notes": "Calabrian Bergamot, Pepper, Vanilla Absolute",
      "Concentration": "Eau de Parfum (EDP)",
      "Size": "3.4 Fl Oz (100 ml)",
      "Origin": "Made in France"
    },
    deliveryInfo: "FREE Delivery by Sunday. Eligible for Prime."
  },
  {
    id: "prod-17",
    name: "Spalding TF-1000 Precision Basketball",
    category: "Sports",
    price: 64.99,
    rating: 4.5,
    image: "https://picsum.photos/seed/basket/600/600",
    description: "Engineered for elite competitive play, the Spalding Precision TF-1000 features a premium micro-fiber cover with deep channels for superior grip.",
    stock: 40,
    brand: "Spalding",
    originalPrice: 79.99,
    discount: 18,
    reviewsCount: 220,
    images: [
      "https://picsum.photos/seed/basket/600/600"
    ],
    specifications: {
      "Size": "Official Size 7 (29.5 inches)",
      "Material": "Eco-Grip composite leather",
      "Bladder": "Butyl bladder for maximum air retention",
      "Play Environment": "Indoor use only",
      "Approved": "NFHS Approved for competitive high-school play"
    },
    deliveryInfo: "FREE Delivery by Saturday."
  },
  {
    id: "prod-18",
    name: "Anker 12V Portable Car Air Compressor & Inflator",
    category: "Automotive",
    price: 49.99,
    rating: 4.4,
    image: "https://picsum.photos/seed/carpump/600/600",
    description: "A fast, powerful car tire inflator featuring smart digital pressure pre-sets, auto-shut off, and built-in emergency LED flashlight.",
    stock: 25,
    brand: "Anker",
    originalPrice: 59.99,
    discount: 16,
    reviewsCount: 440,
    images: [
      "https://picsum.photos/seed/carpump/600/600"
    ],
    specifications: {
      "Input Power": "DC 12V Cigarette Lighter Plug",
      "Max Pressure": "120 PSI",
      "Speed": "Inflates mid-size tire in under 4 minutes",
      "Hose Length": "2.8 feet reinforced rubber hose",
      "Display": "High-accuracy Backlit LCD Screen"
    },
    deliveryInfo: "FREE Delivery by Tomorrow. Order within 3 hrs."
  },
  {
    id: "prod-19",
    name: "Zara Floral Print Organza Dress",
    category: "Women's Clothing",
    price: 89.90,
    rating: 4.5,
    image: "https://picsum.photos/seed/organzadress/600/600",
    description: "Flowing midi dress made of high-quality organza. Features a high collar, long sleeves, elastic cuffs, and elegant floral patterns in warm tones.",
    stock: 18,
    brand: "Zara",
    originalPrice: 119.00,
    discount: 24,
    reviewsCount: 185,
    images: [
      "https://picsum.photos/seed/organzadress/600/600"
    ],
    specifications: {
      "Material": "100% Organza Polyester",
      "Collar": "Mandarin style / High ruffled collar",
      "Length": "Midi / Below-the-knee length",
      "Colors": "Beige and Amber-rose details",
      "Care": "Dry clean recommended or gentle hand-wash"
    },
    deliveryInfo: "FREE Delivery by Saturday. Perfect gift option."
  },
  {
    id: "prod-20",
    name: "Logitech MX Master 3S Wireless Mouse",
    category: "Accessories",
    price: 99.99,
    rating: 4.8,
    image: "https://picsum.photos/seed/mxmouse/600/600",
    description: "An icon remastered. Feel every moment of your workflow with even more precision, tactile click feedback, and 8,000 DPI track-anywhere optical sensor.",
    stock: 50,
    brand: "Logitech",
    originalPrice: 119.99,
    discount: 16,
    reviewsCount: 3150,
    images: [
      "https://picsum.photos/seed/mxmouse/600/600"
    ],
    specifications: {
      "Sensor": "8K DPI optical track-on-glass sensor",
      "Scroll Wheel": "MagSpeed Electromagnetic smart scroll wheel",
      "Connectivity": "Logi Bolt USB, Bluetooth Low Energy",
      "Battery Life": "Up to 70 days on a full charge",
      "Weight": "4.97 oz (141 g)"
    },
    deliveryInfo: "FREE Delivery by Tomorrow. Fast shipping."
  }
];

// Helper to transform file DB format (which uses arrays for JSON Server) to memory DB format (using Records)
const transformFileToMemory = (fileDb: any): DatabaseSchema => {
  const memoryDb: DatabaseSchema = {
    users: {},
    carts: {},
    orders: {},
    products: fileDb.products || []
  };

  // Convert users array to Record
  if (Array.isArray(fileDb.users)) {
    fileDb.users.forEach((u: any) => {
      const usernameKey = u.username.trim().toLowerCase();
      memoryDb.users[usernameKey] = {
        username: u.username,
        passwordHash: u.passwordHash || "",
        walletBalance: u.walletBalance ?? 5000.00,
        addresses: u.addresses || []
      };
    });
  } else if (fileDb.users && typeof fileDb.users === "object") {
    memoryDb.users = fileDb.users;
  }

  // Convert carts array to Record
  if (Array.isArray(fileDb.carts)) {
    fileDb.carts.forEach((c: any) => {
      const usernameKey = c.username.trim().toLowerCase();
      memoryDb.carts[usernameKey] = c.items || [];
    });
  } else if (fileDb.carts && typeof fileDb.carts === "object") {
    memoryDb.carts = fileDb.carts;
  }

  // Convert orders array to Record (grouped by username)
  if (Array.isArray(fileDb.orders)) {
    fileDb.orders.forEach((o: any) => {
      if (o.username) {
        const usernameKey = o.username.trim().toLowerCase();
        if (!memoryDb.orders[usernameKey]) {
          memoryDb.orders[usernameKey] = [];
        }
        const { username, ...orderWithoutUsername } = o;
        memoryDb.orders[usernameKey].push(orderWithoutUsername as Order);
      }
    });
  } else if (fileDb.orders && typeof fileDb.orders === "object") {
    memoryDb.orders = fileDb.orders;
  }

  // Preserve other collections (JSON-server arrays) on the memory object so they can be saved back
  const anyMemoryDb = memoryDb as any;
  anyMemoryDb.categories = fileDb.categories || [];
  anyMemoryDb.reviews = fileDb.reviews || [];
  anyMemoryDb.coupons = fileDb.coupons || [];
  anyMemoryDb.sellers = fileDb.sellers || [];
  anyMemoryDb.addresses = fileDb.addresses || [];
  anyMemoryDb.notifications = fileDb.notifications || [];
  anyMemoryDb.bankOffers = fileDb.bankOffers || [];
  anyMemoryDb.wishlist = fileDb.wishlist || [];

  return memoryDb;
};

// Helper to transform memory DB back to file DB format (with flat arrays)
const transformMemoryToFile = (memoryDb: DatabaseSchema): any => {
  const fileDb: any = {
    products: memoryDb.products || [],
    categories: (memoryDb as any).categories || [],
    users: [],
    reviews: (memoryDb as any).reviews || [],
    orders: [],
    coupons: (memoryDb as any).coupons || [],
    sellers: (memoryDb as any).sellers || [],
    addresses: (memoryDb as any).addresses || [],
    notifications: (memoryDb as any).notifications || [],
    bankOffers: (memoryDb as any).bankOffers || [],
    wishlist: (memoryDb as any).wishlist || [],
    carts: []
  };

  // Convert users Record to array
  Object.values(memoryDb.users).forEach((u: any) => {
    fileDb.users.push({
      id: u.username.trim().toLowerCase(),
      username: u.username,
      passwordHash: u.passwordHash,
      walletBalance: u.walletBalance,
      addresses: u.addresses
    });
  });

  // Convert carts Record to array
  Object.entries(memoryDb.carts).forEach(([username, items]) => {
    fileDb.carts.push({
      id: `cart-${username.trim().toLowerCase()}`,
      username: username,
      items: items
    });
  });

  // Convert orders Record to flat array
  Object.entries(memoryDb.orders).forEach(([username, orders]) => {
    orders.forEach((o: any) => {
      fileDb.orders.push({
        ...o,
        username: username
      });
    });
  });

  return fileDb;
};

export const getDatabase = (): DatabaseSchema => {
  // Ensure backend/database folder exists
  const dataDir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Generate the database if it doesn't exist
  if (!fs.existsSync(DB_FILE_PATH)) {
    try {
      generateMockDatabase(DB_FILE_PATH);
    } catch (genErr) {
      console.error("Faker generation failed, falling back to legacy/initial DB:", genErr);
      const initialDb: DatabaseSchema = {
        users: {},
        carts: {},
        orders: {},
        products: INITIAL_PRODUCTS
      };
      const fileDb = transformMemoryToFile(initialDb);
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(fileDb, null, 2), "utf8");
    }
  }

  try {
    const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const memoryDb = transformFileToMemory(parsed);

    // Overwrite database products if empty, or if we still have the old "Fruits & Vegetables" category
    if (!memoryDb.products || memoryDb.products.length === 0 || memoryDb.products.some(p => p.category === "Fruits & Vegetables")) {
      console.log("Regenerating database as it is empty or has stale products...");
      generateMockDatabase(DB_FILE_PATH);
      const freshRaw = fs.readFileSync(DB_FILE_PATH, "utf8");
      return transformFileToMemory(JSON.parse(freshRaw));
    }

    return memoryDb;
  } catch (err) {
    console.error("Error reading database file, resetting:", err);
    try {
      generateMockDatabase(DB_FILE_PATH);
      const freshRaw = fs.readFileSync(DB_FILE_PATH, "utf8");
      return transformFileToMemory(JSON.parse(freshRaw));
    } catch (fallbackErr) {
      const initialDb: DatabaseSchema = {
        users: {},
        carts: {},
        orders: {},
        products: INITIAL_PRODUCTS
      };
      return initialDb;
    }
  }
};

export const saveDatabase = (db: DatabaseSchema): void => {
  try {
    const dataDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const fileDb = transformMemoryToFile(db);
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(fileDb, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
};

export const syncProductsWithDummyJson = async (): Promise<void> => {
  try {
    console.log("Fetching real products from DummyJSON API...");
    // Fetch all 194 products using limit=0
    const response = await axios.get("https://dummyjson.com/products?limit=0");
    const dummyProducts = response.data.products || [];

    if (!Array.isArray(dummyProducts) || dummyProducts.length === 0) {
      throw new Error("Invalid response format from DummyJSON API");
    }

    // Also fetch dedicated smartphones from DummyJSON to ensure we have real smartphones
    try {
      console.log("Fetching smartphones from dummy mobile API...");
      const smartphoneResponse = await axios.get("https://dummyjson.com/products/category/smartphones");
      if (smartphoneResponse.data && Array.isArray(smartphoneResponse.data.products)) {
        const smartphones = smartphoneResponse.data.products;
        const existingIds = new Set(dummyProducts.map((p: any) => p.id));
        for (const phone of smartphones) {
          if (!existingIds.has(phone.id)) {
            dummyProducts.push(phone);
          }
        }
      }
    } catch (smartErr: any) {
      console.warn("Could not fetch smartphones category from DummyJSON, continuing with main list:", smartErr.message || smartErr);
    }

    console.log(`Successfully fetched and merged ${dummyProducts.length} products from DummyJSON. Mapping products...`);

    const mappedProducts: Product[] = dummyProducts.map((p: any) => {
      const discount = p.discountPercentage ? Math.round(p.discountPercentage) : 0;
      const price = p.price;
      const originalPrice = discount > 0 ? parseFloat((price / (1 - discount / 100)).toFixed(2)) : price;
      const reviewsCount = p.reviews && p.reviews.length ? p.reviews.length * 12 + 5 : Math.floor(Math.random() * 200) + 10;
      const mainImage = p.thumbnail || (p.images && p.images[0]) || "https://picsum.photos/seed/qkart/600/600";
      const additionalImages = p.images && p.images.length ? p.images : [mainImage];
      
      const specs: Record<string, string> = {};
      if (p.brand) specs["Brand"] = p.brand;
      if (p.sku) specs["SKU"] = p.sku;
      if (p.weight) specs["Weight"] = `${p.weight} kg`;
      if (p.dimensions) specs["Dimensions"] = `${p.dimensions.width}x${p.dimensions.height}x${p.dimensions.depth} cm`;
      if (p.warrantyInformation) specs["Warranty"] = p.warrantyInformation;
      if (p.shippingInformation) specs["Shipping"] = p.shippingInformation;
      if (p.returnPolicy) specs["Return Policy"] = p.returnPolicy;

      let formattedCategory = p.category
        ? p.category.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        : "General";

      if (formattedCategory === "Smartphones") {
        formattedCategory = "Mobiles";
      }

      return {
        id: `prod-${p.id}`,
        name: p.title,
        category: formattedCategory,
        price: price,
        rating: p.rating || 4.0,
        image: mainImage,
        description: p.description || "",
        stock: p.stock || 10,
        brand: p.brand || "Generic",
        originalPrice: originalPrice,
        discount: discount,
        reviewsCount: reviewsCount,
        images: additionalImages,
        specifications: specs,
        deliveryInfo: p.shippingInformation || "FREE Delivery in 3-5 days. Eligible for Prime."
      };
    });

    // Also fetch from FakeStoreAPI to enrich Genders and fashion options
    try {
      console.log("Fetching additional products from FakeStoreAPI...");
      const fakeStoreResponse = await axios.get("https://fakestoreapi.com/products");
      if (fakeStoreResponse.data && Array.isArray(fakeStoreResponse.data)) {
        console.log(`Successfully fetched ${fakeStoreResponse.data.length} products from FakeStoreAPI. Merging...`);
        
        for (const p of fakeStoreResponse.data) {
          const discount = Math.floor(Math.random() * 16) + 10; // 10-25% discount
          const price = p.price;
          const originalPrice = parseFloat((price / (1 - discount / 100)).toFixed(2));
          const reviewsCount = p.rating?.count || Math.floor(Math.random() * 150) + 12;
          const mainImage = p.image;
          
          let formattedCategory = "General";
          const fakeCat = p.category.toLowerCase();
          if (fakeCat === "men's clothing") {
            formattedCategory = "Mens Clothing";
          } else if (fakeCat === "women's clothing") {
            formattedCategory = "Womens Clothing";
          } else if (fakeCat === "jewelery") {
            formattedCategory = "Womens Jewellery";
          } else if (fakeCat === "electronics") {
            formattedCategory = "Electronics";
          } else {
            formattedCategory = p.category
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          // Check if product with this title already exists in DummyJSON to avoid obvious duplicates
          const exists = mappedProducts.some(mp => mp.name.toLowerCase() === p.title.toLowerCase());
          if (!exists) {
            mappedProducts.push({
              id: `prod-fake-${p.id}`,
              name: p.title,
              category: formattedCategory,
              price: price,
              rating: p.rating?.rate || 4.2,
              image: mainImage,
              description: p.description || "",
              stock: Math.floor(Math.random() * 80) + 20,
              brand: "Imported Brand",
              originalPrice: originalPrice,
              discount: discount,
              reviewsCount: reviewsCount,
              images: [mainImage],
              specifications: {
                "Brand": "Imported Brand",
                "Collection": formattedCategory,
                "Quality Grade": "Premium Quality"
              },
              deliveryInfo: "FREE Delivery. Eligible for Prime."
            });
          }
        }
      }
    } catch (fakeErr: any) {
      console.warn("Could not fetch products from FakeStoreAPI, proceeding with existing list:", fakeErr.message || fakeErr);
    }

    // Define highly polished Kids and Baby products dataset covering infant, toddler, kid, and teen age ranges
    const kidsProducts: Product[] = [
      {
        id: "prod-kids-1",
        name: "Lullaby Club Unisex Organic Cotton Romper (Pack of 3)",
        category: "Baby Clothing",
        price: 19.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80",
        description: "Ultra-soft, breathable organic cotton rompers with easy snap closures. Perfect for newborn and infant sensitive skin. GOTS certified.",
        stock: 85,
        brand: "Lullaby Club",
        originalPrice: 24.99,
        discount: 20,
        reviewsCount: 142,
        images: [
          "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80"
        ],
        specifications: {
          "Material": "100% Organic Cotton",
          "Sizes": "0-3M, 3-6M, 6-12M, 12-18M",
          "Age Range": "Infant (0-18 Months)",
          "Gender": "Unisex",
          "Care Instructions": "Machine wash cold, tumble dry low"
        },
        deliveryInfo: "FREE Delivery tomorrow for Prime members."
      },
      {
        id: "prod-kids-2",
        name: "Tiny Toes Soft-Sole Anti-Slip Infant Booties",
        category: "Baby Clothing",
        price: 12.49,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
        description: "Cozy fleece booties designed to stay on active feet with an elastic ankle support and non-slip silicone grips on soles.",
        stock: 50,
        brand: "Tiny Toes",
        originalPrice: 15.99,
        discount: 22,
        reviewsCount: 88,
        images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "Fleece Upper, Cotton Lining",
          "Age Range": "0-12 Months",
          "Gender": "Unisex",
          "Sole Type": "Anti-slip silicone grip"
        },
        deliveryInfo: "Ships in 1-2 business days."
      },
      {
        id: "prod-kids-3",
        name: "Mini Explorer Toddler Hooded Dino Bathrobe",
        category: "Baby Clothing",
        price: 17.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
        description: "Highly absorbent micro-fleece dinosaur bathrobe with sensory spines on the hood. Warm, plush, and extremely adorable.",
        stock: 65,
        brand: "Mini Explorer",
        originalPrice: 21.99,
        discount: 18,
        reviewsCount: 195,
        images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "Premium Micro-Fleece",
          "Age Range": "Toddler (2-4 Years)",
          "Gender": "Unisex",
          "Style": "Dinosaur Hooded"
        },
        deliveryInfo: "FREE Delivery in 2-3 business days."
      },
      {
        id: "prod-kids-4",
        name: "Girls Floral Embroidered Cotton Summer Dress",
        category: "Girls Clothing",
        price: 24.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80",
        description: "A gorgeous, lightweight summer dress featuring beautiful hand-embroidered flowers, a flared skirt, and a comfortable lining.",
        stock: 40,
        brand: "Little Joy",
        originalPrice: 32.99,
        discount: 24,
        reviewsCount: 112,
        images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "100% Breathable Cotton",
          "Sizes": "3T, 4T, 5, 6, 7, 8",
          "Age Range": "Kids (3-8 Years)",
          "Gender": "Girls",
          "Occasion": "Casual Summer Wear"
        },
        deliveryInfo: "Ships overnight. Eligible for Prime."
      },
      {
        id: "prod-kids-5",
        name: "Girls Sequin Star Denim Jacket",
        category: "Girls Clothing",
        price: 29.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1471286174243-e7a4d9afb34a?w=600&auto=format&fit=crop&q=80",
        description: "High-quality soft-washed denim jacket with a stunning sequined star design on the back. Durable metal button enclosures.",
        stock: 35,
        brand: "Starlet",
        originalPrice: 39.99,
        discount: 25,
        reviewsCount: 74,
        images: ["https://images.unsplash.com/photo-1471286174243-e7a4d9afb34a?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "98% Cotton, 2% Elastane",
          "Sizes": "5, 6, 8, 10, 12",
          "Age Range": "Kids & Teens (5-12 Years)",
          "Gender": "Girls"
        },
        deliveryInfo: "FREE Delivery in 3-5 days."
      },
      {
        id: "prod-kids-6",
        name: "Boys Heavy-Duty Camouflage Cargo Joggers",
        category: "Boys Clothing",
        price: 21.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80",
        description: "Sturdy cargo pants with elastic joggers cuffs and drawstring waistband. Features reinforced knees for rugged, outdoor playtime.",
        stock: 75,
        brand: "Rough & Tumble",
        originalPrice: 27.99,
        discount: 21,
        reviewsCount: 130,
        images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "Cotton Canvas Ripstop",
          "Sizes": "4T, 5, 6, 7, 8, 10",
          "Age Range": "Kids (4-10 Years)",
          "Gender": "Boys"
        },
        deliveryInfo: "Eligible for standard free delivery."
      },
      {
        id: "prod-kids-7",
        name: "Youth Activewear Breathable Athletic Tee (Pack of 2)",
        category: "Boys Clothing",
        price: 15.49,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80",
        description: "Moisture-wicking active tees designed for sports and active kids. Quick-drying fabrics with reflective safety stripes.",
        stock: 120,
        brand: "Junior Sport",
        originalPrice: 19.99,
        discount: 22,
        reviewsCount: 210,
        images: ["https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "100% Polyester Tech Mesh",
          "Sizes": "S, M, L, XL",
          "Age Range": "Youth (8-14 Years)",
          "Gender": "Boys / Unisex"
        },
        deliveryInfo: "FREE Delivery tomorrow with Prime."
      },
      {
        id: "prod-kids-8",
        name: "Kids Light-Up Active Play Sneakers",
        category: "Kids Shoes",
        price: 34.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80",
        description: "Fun, vibrant sneakers with motion-activated LED lights in the heel. Breathable mesh upper and easy strap closure.",
        stock: 45,
        brand: "Tiny Toes",
        originalPrice: 44.99,
        discount: 22,
        reviewsCount: 165,
        images: ["https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "Breathable Mesh, EVA Sole",
          "Age Range": "Kids (3-8 Years)",
          "Gender": "Unisex",
          "Feature": "Motion-activated LED heel lights"
        },
        deliveryInfo: "Ships in 2-3 business days."
      },
      {
        id: "prod-kids-9",
        name: "Interactive Wooden Montessori Activity Cube",
        category: "Toys & Games",
        price: 39.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
        description: "5-in-1 educational wooden toy with bead maze, shape sorter, spinning gears, and sliding clock. Encourages motor skills and cognitive development.",
        stock: 30,
        brand: "Smart Start",
        originalPrice: 49.99,
        discount: 20,
        reviewsCount: 284,
        images: ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "Natural Beechwood, Non-toxic Paints",
          "Age Range": "Toddler (1-3 Years)",
          "Dimensions": "30x30x40 cm",
          "Safety": "ASTM F963 Certified"
        },
        deliveryInfo: "Ships in 1-2 business days."
      },
      {
        id: "prod-kids-10",
        name: "Ultra-Soft Cozy Weighted Teddy Bear",
        category: "Toys & Games",
        price: 18.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80",
        description: "Plush therapeutic teddy bear with a gentle 1.5 lb weight, providing pressure stimulation to help kids calm down and sleep better.",
        stock: 90,
        brand: "Lullaby Club",
        originalPrice: 24.99,
        discount: 24,
        reviewsCount: 310,
        images: ["https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "Hypoallergenic Micro-Plush, Glass Beads",
          "Weight": "1.5 lbs / 700g",
          "Age Range": "3 Years and Up",
          "Gender": "Unisex"
        },
        deliveryInfo: "Ships overnight. Eligible for Prime."
      },
      {
        id: "prod-kids-11",
        name: "Teens Pastel Tie-Dye Oversized Hoodie",
        category: "Girls Clothing",
        price: 32.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
        description: "Super trendy oversized pastel wash tie-dye hoodie, constructed from thick premium French terry cotton. Ultra comfortable and stylish.",
        stock: 45,
        brand: "Urban Youth",
        originalPrice: 42.99,
        discount: 23,
        reviewsCount: 94,
        images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "100% French Terry Cotton",
          "Sizes": "XS, S, M, L",
          "Age Range": "Teens (12-18 Years)",
          "Gender": "Girls / Unisex"
        },
        deliveryInfo: "FREE Delivery tomorrow with Prime."
      },
      {
        id: "prod-kids-12",
        name: "Youth Premium Urban Knit High-Top Sneakers",
        category: "Kids Shoes",
        price: 45.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        description: "Extremely lightweight knit high-top sneakers with memory foam insoles, breathable sport weave, and high traction rubber outsoles.",
        stock: 60,
        brand: "Stride Tech",
        originalPrice: 59.99,
        discount: 23,
        reviewsCount: 118,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"],
        specifications: {
          "Material": "Recycled Flyknit, Rubber Sole",
          "Sizes": "Y3, Y4, Y5, Y6, Y7",
          "Age Range": "Youth / Teens (10-16 Years)",
          "Gender": "Unisex"
        },
        deliveryInfo: "Ships overnight. Eligible for Prime."
      }
    ];

    // Merge kids dataset into mappedProducts
    mappedProducts.push(...kidsProducts);

    const uniqueCats = Array.from(new Set(mappedProducts.map((p) => p.category)));
    const categoriesList = uniqueCats.map((cat, idx) => ({
      id: `cat-${idx + 1}`,
      name: cat,
      slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: `Explore top-quality products in ${cat} on QKart.`
    }));

    const db = getDatabase();
    db.products = mappedProducts;
    (db as any).categories = categoriesList;
    saveDatabase(db);

    console.log(`Database synced. Mapped ${mappedProducts.length} products and ${categoriesList.length} categories.`);
  } catch (err: any) {
    console.error("Failed to sync products with DummyJSON:", err.message || err);
    throw err;
  }
};
