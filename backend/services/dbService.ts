/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { DB_FILE_PATH } from "../config/config";
import { Product, CartItem, Order } from "../types";

export interface DatabaseSchema {
  users: Record<string, { username: string; passwordHash: string; walletBalance: number; addresses: string[] }>;
  carts: Record<string, CartItem[]>;
  orders: Record<string, Order[]>;
  products: Product[];
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Organic Cavendish Bananas",
    category: "Fruits & Vegetables",
    price: 2.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    description: "Sweet, organic, and perfectly ripe bananas. Sourced directly from certified sustainable local organic orchards.",
    stock: 50
  },
  {
    id: "prod-2",
    name: "Fresh Organic Strawberries",
    category: "Fruits & Vegetables",
    price: 4.49,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80",
    description: "Sweet, juicy, and vibrant red hand-picked organic strawberries. Packed with rich antioxidants and vitamin C.",
    stock: 35
  },
  {
    id: "prod-3",
    name: "Hass Avocado (Pack of 2)",
    category: "Fruits & Vegetables",
    price: 3.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80",
    description: "Rich, creamy, buttery-soft Hass avocados. Highly versatile and perfect for making custom guacamole or morning sourdough toast.",
    stock: 40
  },
  {
    id: "prod-4",
    name: "Organic Whole Milk (1 Gallon)",
    category: "Dairy & Bakery",
    price: 5.49,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    description: "Creamy, wholesome, and cold-pasteurized organic whole milk from grass-fed cows. High in naturally occurring calcium.",
    stock: 25
  },
  {
    id: "prod-5",
    name: "Artisanal Sourdough Bread",
    category: "Dairy & Bakery",
    price: 6.29,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80",
    description: "Freshly baked handcrafted sourdough loaf featuring a crispy, dark-golden crust and a light, wonderfully airy crumb structure.",
    stock: 15
  },
  {
    id: "prod-6",
    name: "Chilled Salted Butter (8 oz)",
    category: "Dairy & Bakery",
    price: 3.89,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
    description: "Creamy, slowly-churned premium salted butter. Made from sweet pasteurized cream. Great for baking and morning spreads.",
    stock: 30
  },
  {
    id: "prod-7",
    name: "Organic Green Tea (20 bags)",
    category: "Beverages",
    price: 4.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1524638067-feba7e8ed70f?w=600&auto=format&fit=crop&q=80",
    description: "Pure Japanese organic sencha green tea. Refreshing, smooth, earthy taste notes packed with healthy antioxidants.",
    stock: 60
  },
  {
    id: "prod-8",
    name: "Cold Brew Coffee Concentrate",
    category: "Beverages",
    price: 7.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    description: "Smooth, bold, ultra-low-acid cold-brewed coffee concentrate. Ready to mix with cold milk, oat milk, or chilled water.",
    stock: 20
  },
  {
    id: "prod-9",
    name: "Sparkling Lime Water (Pack of 6)",
    category: "Beverages",
    price: 5.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&auto=format&fit=crop&q=80",
    description: "Crisp, fizzy, effervescent sparkling mineral water naturally infused with clean, zesty squeeze of key limes. Zero calories.",
    stock: 45
  },
  {
    id: "prod-10",
    name: "Premium Roasted Almonds (12 oz)",
    category: "Snacks & Branded Foods",
    price: 8.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80",
    description: "Golden slow-roasted, lightly-salted premium nonpareil California almonds. An incredibly healthy, fiber-rich crunchy snack.",
    stock: 50
  },
  {
    id: "prod-11",
    name: "Dark Chocolate Sea Salt Bar",
    category: "Snacks & Branded Foods",
    price: 3.49,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&auto=format&fit=crop&q=80",
    description: "Premium single-origin 72% dark cacao Belgian chocolate bar, sprinkled with delicate flakes of French sea salt.",
    stock: 80
  },
  {
    id: "prod-12",
    name: "Golden Honey Oats Granola",
    category: "Snacks & Branded Foods",
    price: 6.49,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?w=600&auto=format&fit=crop&q=80",
    description: "Crunchy clusters of baked whole-grain rolled oats generously glazed with organic forest honey, sunflower seeds, and almonds.",
    stock: 35
  },
  {
    id: "prod-13",
    name: "Smart ANC Wireless Earbuds",
    category: "Electronics & Gadgets",
    price: 49.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    description: "High-fidelity acoustics, Hybrid Active Noise Cancelling (ANC), smart touch gestures, sweat-proofing, and up to 30 hours playback.",
    stock: 15
  },
  {
    id: "prod-14",
    name: "Minimalist LED Desk Lamp",
    category: "Electronics & Gadgets",
    price: 29.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    description: "Flicker-free eye-protective modern LED desk lamp with 5 brightness sliders, 3 color spectrums, and a built-in USB charge port.",
    stock: 18
  },
  {
    id: "prod-15",
    name: "Double-Walled Steel Bottle",
    category: "Household Needs",
    price: 14.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    description: "Vacuum insulated 32 oz heavy-duty 18/8 stainless steel bottle. Keeps water frosty cold for 24h or steaming hot for 12h.",
    stock: 22
  },
  {
    id: "prod-16",
    name: "Scented Soy Candle (Lavender)",
    category: "Household Needs",
    price: 11.99,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
    description: "Hand-poured aromatic natural soy wax candle, infused with premium organic French lavender essential oils. Slow burning (45 hours).",
    stock: 30
  }
];

export const getDatabase = (): DatabaseSchema => {
  // Ensure backend/data folder exists
  const dataDir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // If new DB doesn't exist but legacy root DB exists, copy it
  const legacyDbPath = path.join(process.cwd(), "data", "qkart_db.json");
  if (!fs.existsSync(DB_FILE_PATH) && fs.existsSync(legacyDbPath)) {
    try {
      fs.copyFileSync(legacyDbPath, DB_FILE_PATH);
      console.log("Migrated legacy DB from /data/qkart_db.json to backend DB location");
    } catch (e) {
      console.error("Failed to migrate legacy database:", e);
    }
  }

  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialDb: DatabaseSchema = {
      users: {},
      carts: {},
      orders: {},
      products: INITIAL_PRODUCTS
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialDb, null, 2), "utf8");
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.products || parsed.products.length === 0) {
      parsed.products = INITIAL_PRODUCTS;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database file, resetting:", err);
    const initialDb: DatabaseSchema = {
      users: {},
      carts: {},
      orders: {},
      products: INITIAL_PRODUCTS
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialDb, null, 2), "utf8");
    return initialDb;
  }
};

export const saveDatabase = (db: DatabaseSchema): void => {
  try {
    const dataDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
};
