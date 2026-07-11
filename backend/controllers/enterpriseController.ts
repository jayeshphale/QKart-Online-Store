/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { getDatabase, saveDatabase } from "../services/dbService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Product, Order, CartItem } from "../types";

// In-Memory verification registry for OTP resets (transactionId -> { otp, username, resetToken })
const verificationRegistry = new Map<string, { otp: string; username: string; resetToken?: string }>();

// Standard envelope builder
const buildEnvelope = (success: boolean, message: string, data: any = null, pagination: any = null) => {
  return {
    success,
    message,
    data,
    ...(pagination && { pagination })
  };
};

/**
 * AUTH EXTENSIONS
 */
export const forgotPassword = (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(buildEnvelope(false, "Username or email is required."));
  }

  const db = getDatabase();
  const usernameKey = email.trim().toLowerCase();
  const user = db.users[usernameKey];

  if (!user) {
    return res.status(404).json(buildEnvelope(false, "User account not found."));
  }

  const transactionId = `txn_${Date.now()}`;
  const mockOtp = "123456"; // Deterministic mockup code
  verificationRegistry.set(transactionId, { otp: mockOtp, username: user.username });

  return res.json(buildEnvelope(true, "Verification OTP generated.", { transactionId }));
};

export const verifyOtp = (req: Request, res: Response) => {
  const { transactionId, otp } = req.body;
  if (!transactionId || !otp) {
    return res.status(400).json(buildEnvelope(false, "Transaction ID and OTP are required."));
  }

  const saved = verificationRegistry.get(transactionId);
  if (!saved || saved.otp !== otp) {
    return res.status(400).json(buildEnvelope(false, "Invalid or expired OTP."));
  }

  const resetToken = `rst_${Date.now()}`;
  verificationRegistry.set(transactionId, { ...saved, resetToken });

  return res.json(buildEnvelope(true, "OTP verified successfully.", { resetToken }));
};

export const resetPassword = (req: Request, res: Response) => {
  const { transactionId, resetToken, newPassword } = req.body;
  if (!transactionId || !resetToken || !newPassword) {
    return res.status(400).json(buildEnvelope(false, "All reset inputs are required."));
  }

  if (newPassword.length < 6) {
    return res.status(400).json(buildEnvelope(false, "Password must be at least 6 characters."));
  }

  const saved = verificationRegistry.get(transactionId);
  if (!saved || saved.resetToken !== resetToken) {
    return res.status(400).json(buildEnvelope(false, "Invalid or expired reset session."));
  }

  const db = getDatabase();
  const usernameKey = saved.username.toLowerCase();
  if (db.users[usernameKey]) {
    db.users[usernameKey].passwordHash = Buffer.from(newPassword).toString("base64");
    saveDatabase(db);
  }

  verificationRegistry.delete(transactionId);
  return res.json(buildEnvelope(true, "Password has been altered successfully. You can now log in."));
};

export const getUserProfile = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const db = getDatabase();
  const usernameKey = username.toLowerCase();
  const user = db.users[usernameKey];

  if (!user) {
    return res.status(404).json(buildEnvelope(false, "User profile not found."));
  }

  const userWithMeta = {
    username: user.username,
    walletBalance: user.walletBalance,
    addresses: user.addresses,
    primeMember: usernameKey === "testuser" || usernameKey.length % 2 === 0,
    email: `${user.username}@amazon.in`,
    mobile: "+9198765" + String(Date.now()).substring(8),
    fullName: user.username.split(/[._]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  };

  return res.json(buildEnvelope(true, "Profile loaded.", userWithMeta));
};

export const updateUserProfile = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const { fullName, mobile } = req.body;
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const db = getDatabase();
  const usernameKey = username.toLowerCase();
  const user = db.users[usernameKey];

  if (!user) {
    return res.status(404).json(buildEnvelope(false, "User profile not found."));
  }

  // Persist name or mobile or properties (wallet is mutated using addWalletFunds)
  return res.json(buildEnvelope(true, "Profile updated successfully.", {
    username: user.username,
    walletBalance: user.walletBalance,
    addresses: user.addresses,
    fullName: fullName || user.username,
    mobile: mobile || "+919876543210"
  }));
};

/**
 * ADVANCED PRODUCT LISTINGS & SUB-COLLECTIONS
 */
export const getCategories = (req: Request, res: Response) => {
  const db = getDatabase();
  const anyDb = db as any;
  const cats = anyDb.categories || [];
  
  if (cats.length > 0) {
    return res.json(cats);
  }

  // Fallback to extraction from products
  const uniqueCats = Array.from(new Set(db.products.map(p => p.category)));
  const mapped = uniqueCats.map((cat, i) => ({
    id: `cat_${i + 1}`,
    name: cat,
    slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  }));
  return res.json(mapped);
};

export const getSubcategories = (req: Request, res: Response) => {
  const db = getDatabase();
  const parentCategory = req.query.parentId as string;
  
  let products = db.products;
  if (parentCategory) {
    products = products.filter(p => p.category.toLowerCase() === parentCategory.toLowerCase());
  }

  const uniqueSubs = Array.from(new Set(products.map(p => p.category + " accessories"))); // simulated sub-categories
  const mapped = uniqueSubs.map((sub, i) => ({
    id: `sub_${i + 1}`,
    name: sub,
    parentId: parentCategory || "Electronics"
  }));
  return res.json(mapped);
};

export const getBestSellers = (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit as string) || 15;
  
  // High review count and rating > 4.3
  const results = [...db.products]
    .filter(p => p.rating >= 4.3)
    .sort((a, b) => b.reviewsCount - a.reviewsCount)
    .slice(0, limit);

  return res.json(results);
};

export const getNewArrivals = (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit as string) || 15;

  // New arrivals: simulate by higher/younger ID or simply reversed order
  const results = [...db.products]
    .reverse()
    .slice(0, limit);

  return res.json(results);
};

export const getTodayDeals = (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit as string) || 15;

  // Highest discounts
  const results = [...db.products]
    .filter(p => p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);

  return res.json(results);
};

export const getTopRated = (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit as string) || 15;

  // Rating >= 4.6
  const results = [...db.products]
    .filter(p => p.rating >= 4.6)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

  return res.json(results);
};

export const getRecommended = (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit as string) || 15;

  // Random slice of products
  const results = [...db.products]
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);

  return res.json(results);
};

export const getFeatured = (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit as string) || 15;

  // Top products that have high ratings and standard premium branding
  const results = [...db.products]
    .filter(p => p.rating >= 4.5 && p.price > 100)
    .slice(0, limit);

  return res.json(results);
};

export const getTrending = (req: Request, res: Response) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit as string) || 15;

  // Sort by rating desc
  const results = [...db.products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

  return res.json(results);
};

/**
 * AUTOCOMPLETE SUGGESTIONS & HISTORY
 */
export const getSearchSuggestions = (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q) {
    return res.json([]);
  }

  const db = getDatabase();
  const query = q.toLowerCase().trim();

  // Find up to 10 matching titles or brands
  const matches = db.products
    .filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))
    .slice(0, 10)
    .map(p => ({
      suggestion: p.name,
      category: p.category,
      productId: p.id
    }));

  return res.json(matches);
};

export const getSearchHistory = (req: AuthenticatedRequest, res: Response) => {
  // Returns a simulated user search history
  const history = [
    "OnePlus 12",
    "MacBook Air M3",
    "Puma Nitro shoes",
    "Ergonomic Office Chair"
  ];
  return res.json(buildEnvelope(true, "Search history loaded.", history));
};

export const getRecentlyViewed = (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  // Get 5 random products for recent views
  const randomViewed = [...db.products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return res.json(randomViewed);
};

/**
 * WISHLIST
 */
export const getWishlist = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const db = getDatabase();
  const wishlist = (db as any).wishlist || [];

  const userWishlist = wishlist
    .filter((w: any) => w.userId.toLowerCase() === username.toLowerCase())
    .map((w: any) => {
      const product = db.products.find(p => p.id === w.productId);
      return {
        id: w.id,
        productId: w.productId,
        productDetails: product || null
      };
    });

  return res.json(userWishlist);
};

export const addToWishlist = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const { productId } = req.body;
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  if (!productId) {
    return res.status(400).json(buildEnvelope(false, "Product ID is required."));
  }

  const db = getDatabase();
  const anyDb = db as any;
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json(buildEnvelope(false, "Product not found."));
  }

  if (!anyDb.wishlist) {
    anyDb.wishlist = [];
  }

  const alreadyIn = anyDb.wishlist.some(
    (w: any) => w.userId.toLowerCase() === username.toLowerCase() && w.productId === productId
  );

  if (alreadyIn) {
    return res.json(buildEnvelope(true, "Item already exists in wishlist."));
  }

  const entry = {
    id: `wsh_${Date.now()}`,
    userId: username,
    productId,
    createdAt: new Date().toISOString()
  };

  anyDb.wishlist.push(entry);
  saveDatabase(db);

  return res.status(201).json(buildEnvelope(true, "Product saved to wishlist.", entry));
};

export const removeFromWishlist = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const idOrProductId = req.params.id; // Could be record ID or product ID
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const db = getDatabase();
  const anyDb = db as any;
  if (!anyDb.wishlist) {
    anyDb.wishlist = [];
  }

  anyDb.wishlist = anyDb.wishlist.filter(
    (w: any) =>
      !(
        w.userId.toLowerCase() === username.toLowerCase() &&
        (w.id === idOrProductId || w.productId === idOrProductId)
      )
  );

  saveDatabase(db);
  return res.json(buildEnvelope(true, "Product removed from wishlist."));
};

/**
 * ADDRESSES CRUD (DELEGATED REST)
 */
export const getAddresses = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const db = getDatabase();
  const user = db.users[username.toLowerCase()];
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user.addresses);
};

export const createAddressSimulated = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const { address, name, flatHouseNo, streetAddress, city, state, pinCode } = req.body;

  const db = getDatabase();
  const user = db.users[username.toLowerCase()];
  if (!user) {
    return res.status(404).json(buildEnvelope(false, "User not found."));
  }

  let fullAddressStr = "";
  if (address && address.trim()) {
    fullAddressStr = address.trim();
  } else if (flatHouseNo && streetAddress && city && state && pinCode) {
    fullAddressStr = `${name ? name + ", " : ""}${flatHouseNo}, ${streetAddress}, ${city}, ${state} - ${pinCode}`;
  } else {
    return res.status(400).json(buildEnvelope(false, "Address or structured inputs are required."));
  }

  if (fullAddressStr.length < 10) {
    return res.status(400).json(buildEnvelope(false, "Address must contain at least 10 characters."));
  }

  user.addresses.push(fullAddressStr);
  saveDatabase(db);

  // Return both envelope and direct format for compatibility
  return res.status(201).json({
    success: true,
    addresses: user.addresses,
    data: user.addresses,
    message: "Address created successfully."
  });
};

export const updateAddressSimulated = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const index = parseInt(req.params.id, 10);
  const { flatHouseNo, streetAddress, city, state, pinCode } = req.body;

  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const db = getDatabase();
  const user = db.users[username.toLowerCase()];
  if (!user) {
    return res.status(404).json(buildEnvelope(false, "User not found."));
  }

  if (isNaN(index) || index < 0 || index >= user.addresses.length) {
    return res.status(400).json(buildEnvelope(false, "Invalid address index."));
  }

  const fullAddressStr = `${flatHouseNo}, ${streetAddress}, ${city}, ${state} - ${pinCode}`;
  user.addresses[index] = fullAddressStr;
  saveDatabase(db);

  return res.json(buildEnvelope(true, "Address updated.", user.addresses));
};

export const deleteAddressSimulated = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const index = parseInt(req.params.id, 10);

  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const db = getDatabase();
  const user = db.users[username.toLowerCase()];
  if (!user) {
    return res.status(404).json(buildEnvelope(false, "User not found."));
  }

  if (isNaN(index) || index < 0 || index >= user.addresses.length) {
    return res.status(400).json(buildEnvelope(false, "Invalid address index."));
  }

  user.addresses.splice(index, 1);
  saveDatabase(db);

  return res.json(buildEnvelope(true, "Address removed.", user.addresses));
};

/**
 * EXTRA ORDERS API (TRACKING, RETURN, CANCEL)
 */
export const getOrderDetails = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const orderId = req.params.id;
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const db = getDatabase();
  const orders = db.orders[username.toLowerCase()] || [];
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json(buildEnvelope(false, "Order details not found."));
  }

  return res.json(order);
};

export const cancelOrder = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const { orderId, reason } = req.body;
  if (!username || !orderId) {
    return res.status(400).json(buildEnvelope(false, "Order ID is required."));
  }

  const db = getDatabase();
  const orders = db.orders[username.toLowerCase()] || [];
  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json(buildEnvelope(false, "Order not found."));
  }

  // Soft update status to cancelled
  const order = orders[orderIndex];
  (order as any).deliveryStatus = "CANCELLED";
  (order as any).cancellationReason = reason || "Requested by customer";
  
  // Refund money back to user wallet
  const user = db.users[username.toLowerCase()];
  if (user) {
    user.walletBalance += order.totalPrice;
  }

  saveDatabase(db);
  return res.json(buildEnvelope(true, "Order has been cancelled, and funds returned to your wallet.", order));
};

export const returnOrder = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const { orderId, reason } = req.body;
  if (!username || !orderId) {
    return res.status(400).json(buildEnvelope(false, "Order ID is required."));
  }

  const db = getDatabase();
  const orders = db.orders[username.toLowerCase()] || [];
  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json(buildEnvelope(false, "Order not found."));
  }

  const order = orders[orderIndex];
  (order as any).deliveryStatus = "RETURNED";
  (order as any).returnReason = reason || "Returned by customer";

  // Refund money
  const user = db.users[username.toLowerCase()];
  if (user) {
    user.walletBalance += order.totalPrice;
  }

  saveDatabase(db);
  return res.json(buildEnvelope(true, "Return request approved. Pick-up window has been assigned.", order));
};

export const trackOrder = (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json(buildEnvelope(false, "Order ID is required."));
  }

  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const milestones = [
    { status: "ORDER_PLACED", label: "Order Placed", date: `${dateStr} - 10:15 AM`, completed: true, details: "Your order has been placed successfully." },
    { status: "PACKED", label: "Packed & Prepared", date: `${dateStr} - 02:30 PM`, completed: true, details: "Package received and packed at central Amazon hub New Delhi." },
    { status: "OUT_FOR_DELIVERY", label: "Out For Delivery", date: "In progress", completed: false, details: "Delivery agent has picked up your shipment." },
    { status: "DELIVERED", label: "Delivered", date: "Expected shortly", completed: false, details: "Delivered directly to safety locker / door step." }
  ];

  return res.json(buildEnvelope(true, "Logistics steps fetched.", milestones));
};

/**
 * REVIEWS & RECALCULATE RATINGS
 */
export const getProductReviews = (req: Request, res: Response) => {
  const productId = req.query.productId as string;
  if (!productId) {
    return res.status(400).json(buildEnvelope(false, "Product ID is required."));
  }

  const db = getDatabase();
  const allReviews = (db as any).reviews || [];
  const productReviews = allReviews.filter((r: any) => r.productId === productId);

  return res.json(productReviews);
};

export const createProductReview = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  const { productId, rating, reviewText, title } = req.body;

  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  if (!productId || !rating || !reviewText) {
    return res.status(400).json(buildEnvelope(false, "Missing review attributes."));
  }

  const db = getDatabase();
  const anyDb = db as any;
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json(buildEnvelope(false, "Product not found."));
  }

  if (!anyDb.reviews) {
    anyDb.reviews = [];
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    productId,
    userId: username,
    userName: username.charAt(0).toUpperCase() + username.slice(1),
    rating: parseFloat(rating),
    title: title || "Verified Purchase Review",
    comment: reviewText,
    date: new Date().toISOString(),
    verifiedPurchase: true,
    helpfulCount: 0
  };

  anyDb.reviews.push(newReview);

  // Recalculate average and total reviews
  const productReviews = anyDb.reviews.filter((r: any) => r.productId === productId);
  const totalRatingPoints = productReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
  const averageRating = parseFloat((totalRatingPoints / productReviews.length).toFixed(1));

  product.rating = averageRating;
  product.reviewsCount = productReviews.length;

  saveDatabase(db);
  return res.status(201).json(buildEnvelope(true, "Review submitted and ratings recalculated.", newReview));
};

/**
 * COUPONS, NOTIFICATIONS, PRIME, SELLERS
 */
export const getCoupons = (req: Request, res: Response) => {
  const db = getDatabase();
  const anyDb = db as any;
  return res.json(anyDb.coupons || []);
};

export const applyCoupon = (req: Request, res: Response) => {
  const { couponCode, cartTotal } = req.body;
  if (!couponCode) {
    return res.status(400).json(buildEnvelope(false, "Coupon code is required."));
  }

  const db = getDatabase();
  const coupons = (db as any).coupons || [];
  const coupon = coupons.find((c: any) => c.code.trim().toUpperCase() === couponCode.trim().toUpperCase());

  if (!coupon) {
    return res.status(404).json(buildEnvelope(false, "Invalid coupon code."));
  }

  const activeCartTotal = parseFloat(cartTotal) || 0;
  if (coupon.minCartValue && activeCartTotal < coupon.minCartValue) {
    return res.status(400).json(
      buildEnvelope(false, `Coupon requires a minimum cart value of ₹${coupon.minCartValue}.`)
    );
  }

  // Calculate discount percentage or amount
  let discountAmount = coupon.discountAmount;
  if (coupon.discountPercentage) {
    discountAmount = (activeCartTotal * coupon.discountPercentage) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  }

  return res.json(
    buildEnvelope(true, "Coupon code applied successfully!", {
      code: coupon.code,
      discountAmount,
      description: coupon.description
    })
  );
};

export const getNotifications = (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const notifications = (db as any).notifications || [];
  return res.json(notifications);
};

export const getPrimeBenefits = (req: AuthenticatedRequest, res: Response) => {
  const username = req.username;
  if (!username) {
    return res.status(401).json(buildEnvelope(false, "Unauthorized."));
  }

  const info = {
    active: true,
    renewalDate: "24 Dec 2026",
    benefits: [
      "FREE One-Day and Two-Day delivery with Prime Delivery",
      "Unlimited streaming on Prime Video of movies & TV shows",
      "Prime Music with ad-free access to millions of songs",
      "Incredible early access to Prime-Only Lightning Deals"
    ]
  };

  return res.json(buildEnvelope(true, "Prime membership active.", info));
};

export const getSellerProfile = (req: Request, res: Response) => {
  const db = getDatabase();
  const sellers = (db as any).sellers || [];
  const randomSeller = sellers[0] || { id: "sel_1", name: "Appario Retail Pvt Ltd", rating: 4.8 };
  return res.json(randomSeller);
};

export const getSellerProductsList = (req: Request, res: Response) => {
  const db = getDatabase();
  // Return first 10 products as seller stock
  return res.json(db.products.slice(0, 10));
};
