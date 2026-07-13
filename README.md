# QKart Supermarket

A highly optimized, production-ready full-stack organic e-commerce supermarket and digital shopping mall application. QKart provides users with a seamless, highly responsive, modern online grocery experience with advanced real-time lookups, custom address coordinate management, a secure virtual payment wallet, and a newly integrated dynamic knowledge and support center.

**Live Deployments:**
- **Frontend App (Vercel):** [https://q-kart-online-store.vercel.app/#/](https://q-kart-online-store.vercel.app/#/)
- **Backend API & Service (Render):** [https://qkart-online-store.onrender.com](https://qkart-online-store.onrender.com)

---

## Design and Visual Identity

QKart features a beautifully crafted, adaptive design styled with a premium color palette:
- **Crisp Light and Deep Slate Themes**: Implemented in Tailwind and Material-UI with seamless system-level automatic preferred color scheme detection.
- **Micro-Animations**: Uses high-performance transitions and responsive layouts configured with a custom, desktop-first responsive design.
- **Slick Component Organization**: Clean drawers, responsive bento grids for product card list items, and high-contrast styling with zero visual clutter.
- **Authority Credits**: Crafted with authority and engineering supervision by **[Jayesh Phale](https://linkedin.com/in/jayeshphale)**, integrated natively into the footer design.

---

## Outstanding Key Features

1. **Secure JWT Authentication**: Robust registration and login flows with hashed token validation.
2. **Intended-Destination Protected Routes**: Access protection on `/products`, `/checkout`, and `/orders`. Attempts to enter without being logged in automatically save the target path in `sessionStorage` and redirect to `/login`, returning the user right back upon successful verification.
3. **Auto-Theme and MuiThemeProvider**: Syncs light/dark modes seamlessly between Tailwind utility styles and Material-UI components globally. Detects system theme settings dynamically.
4. **Virtual Checkout Wallet**: Real-time balance calculations, insufficient funds alerts, inline additions, and safe checkout with order receipt tracking.
5. **Shipping Coordinate Address Manager**: Fast inline coordinate additions, edits, and deletions, selecting from multiple saved shipping points.
6. **Performance Engine**: Uses `React.lazy()` and `React.Suspense` chunk splitting, lazy image loading, and a custom 450ms input debouncer for high-speed item catalog searches.
7. **Unified Loggers and Global Errors**: Incorporates a unified backend logging service (`loggerService.ts`), centralized API Express exception wrappers, a customized 404 page, and a global React component `ErrorBoundary`.
8. **Dynamic Info and Support Hub**: A centralized, multi-category knowledge center (`/info/:tabId`) using reusable visual components. It serves 15 comprehensive informational pages under three key categories:
   - **Company**: *About QKart*, *Careers* (with interactive jobs feed and resume parser simulator), *Press Releases*, *Investor Relations* (with live simulated stock trend canvas charts), and *QKart Science* (detailing predictive ML logistics and stable cache engines).
   - **Help & Support**: *Contact Support* (with live support ticket simulator), *Shipping & Delivery*, *Returns & Exchanges*, *Refund Policies*, and *QKart Assistant* (a conversational client-side helper).
   - **Policies**: *Privacy Policy*, *Terms of Use*, *Cookie Preferences*, *Interest-Based Ads*, and *E-Waste Management* (supporting electronic eco-recycle schedule collection).

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Material-UI (MUI), Lucide Icons, Motion (React Animation).
- **Backend**: Node.js, Express, TypeScript, CORS, JSON Web Tokens (JWT), `tsx` hot runtime.
- **Local Database**: Self-contained, lightweight JSON-based file persistence engine (`qkart_db.json`).
- **DevOps/Bundling**: ESBuild bundling, custom Production ESM-to-CommonJS transpiler (`dist/server.cjs`), PostCSS.

---

## Project Folder Structure

```
qkart-root/
├── .env.example                     # Unified environment template configuration
├── package.json                    # Root package descriptor (combines Dev & Run scripts)
├── tsconfig.json                   # Main TypeScript workspace configuration
├── vite.config.ts                  # Vite configuration with Tailwind CSS integrations
├── README.md                       # Comprehensive system manual and technical breakdown
│
├── frontend/                       # Client-side react application code
│   ├── index.html                  # Core HTML file entry point
│   └── src/
│       ├── main.tsx                # Client bootstrapper
│       ├── App.tsx                 # Core app routes, Error Boundary, and Suspense layouts
│       ├── types.ts                # Unified type contracts (Product, CartItem, Order, User)
│       │
│       ├── __tests__/              # Jest & RTL test suites
│       │   └── qkart.test.tsx      # Comprehensive verification scenarios
│       │
│       ├── components/             # Highly reusable UI elements
│       │   ├── AddressForm.tsx     # Inline shipping coordinates input and validation
│       │   ├── AddressList.tsx     # Interactive address coordinates selector and management
│       │   ├── OrderSummary.tsx    # Right-hand side cost calculator and checkout items log
│       │   ├── ErrorBoundary.tsx   # React class-based runtime exception fallback view
│       │   ├── Header.tsx          # Navigation navbar with dark toggler and cart badge
│       │   ├── Footer.tsx          # Dynamic responsive links bar with developer credentials
│       │   ├── ProductCard.tsx     # Organic bento-grid card with Lucide details button
│       │   └── SearchBar.tsx       # 450ms debounced input search handler
│       │
│       ├── context/                # Global React shared state context providers
│       │   ├── AuthContext.tsx     # Syncs JWT tokens, profile coordinates, and wallets
│       │   ├── ThemeContext.tsx    # Implements light/dark mode and global MuiThemeProvider
│       │   ├── CartContext.tsx     # Off-line persistent cart cache syncing with user sessions
│       │   └── NotificationContext.tsx # Centralized notification banner systems
│       │
│       ├── pages/                  # Page-level lazy-loaded views
│       │   ├── HomePage.tsx        # High-impact landing page
│       │   ├── LoginPage.tsx       # Secure credentials gateway with auto-redirections
│       │   ├── ProductsPage.tsx    # Organic grocery catalog and interactive search grids
│       │   ├── ProductDetailsPage.tsx # Detailed specification views and bulk selectors
│       │   ├── CheckoutPage.tsx    # Step-by-step wallet payment gateway
│       │   ├── OrderSuccessPage.tsx# Confirmed delivery details and remaining wallet logs
│       │   ├── OrdersPage.tsx      # Detailed historical receipts tracker
│       │   └── InfoPage.tsx        # Interactive dynamic support and corporate knowledge center
│       └── styles/
│           └── index.css           # Global CSS styling with smooth transitions
│
└── backend/                        # Server-side express application code
    ├── server.ts                   # Core Express runner and middleware setup
    ├── config/
    │   └── config.ts               # Parses JWT secrets, PORTs, and file databases
    ├── controllers/
    │   ├── authController.ts       # Secure registration and token creation
    │   ├── productController.ts    # Catalogs lookup and filter indices
    │   └── walletController.ts     # Process checkouts, balance updates, and orders
    ├── middleware/
    │   ├── authMiddleware.ts       # Verifies incoming HTTP Authorization Bearer JWT header
    │   └── errorMiddleware.ts      # Express centralized error wrapper and diagnostic logging
    ├── services/
    │   ├── dbService.ts            # Read/write thread-safe operations on local database
    │   └── loggerService.ts        # Development-only clean logging, production error tracer
    └── routes/
        └── index.ts                # Mounted route routers
```

---

## Environment Configuration

Set up environment variables using `.env.example` as a template:

### 1. Unified Setup (Root `.env`)
Copy `.env.example` into a new `.env` file in the root:
```bash
cp .env.example .env
```

Review variables:
```env
# Comic configurations (Client)
VITE_API_URL="/api/v1"
VITE_APP_NAME="QKart Supermarket"

# Backend configurations (Server)
PORT=3000
JWT_SECRET="qkart_super_secret_jwt_key_987654"
DB_FILE_PATH="backend/data/qkart_db.json"
```

---

## Installation and Running Guidelines

Ensure you have **Node.js 18+** and **npm** installed.

### Root Combined Commands (Highly Recommended)

The root folder is configured with unified scripts to start and build the entire full-stack app.

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Run the Development Server
This starts the backend Node.js server and mounts Vite as active Express middleware (supporting Hot Module Reloading for styles and files):
```bash
npm run dev
```
Open http://localhost:3000 inside your browser.

#### 3. Build for Production
This builds the static React assets into `frontend/dist` and transpiles the TypeScript backend into a single, optimized `dist/server.cjs` file:
```bash
npm run build
```

#### 4. Run in Production Mode
```bash
npm run start
```

---

## Testing Suites

Run tests using Jest and React Testing Library:
```bash
npm test
```
Verifies registration validation, login error banners, product grids, 450ms search debouncers, and inline shipping address submission forms.

---

## API Endpoints Reference

### Authentication
*   `POST /api/v1/auth/register` - Create a new user account (returns JWT token)
*   `POST /api/v1/auth/login` - Authenticate credentials (returns JWT token, addresses, wallet balance)

### Products
*   `GET /api/v1/products` - List products with optional queries `?q=` (search text), `?category=` (category filter), or `?sortBy=` (price ordering)
*   `GET /api/v1/products/:id` - Fetch details for a specific organic product

### Addresses and Coordinates
*   `POST /api/v1/addresses` - Add a new delivery address
*   `PUT /api/v1/addresses/:index` - Update an address at a specific index
*   `DELETE /api/v1/addresses/:index` - Remove an address

### Wallet, Orders and Checkouts
*   `POST /api/v1/wallet/add` - Top-up the virtual payment wallet
*   `POST /api/v1/checkout` - Checkout the current cart items (processes balance and yields receipt)
*   `GET /api/v1/orders` - View historic orders list

---

## Deployment Instructions

The application is fully deployed and configured across two key services:

### Frontend Deployment (Vercel)
The frontend application is hosted on Vercel:
*   **Live App URL**: [https://q-kart-online-store.vercel.app/#/](https://q-kart-online-store.vercel.app/#/)
*   **Build Command**: `npm run build:frontend`
*   **Output Directory**: `frontend/dist`
*   **API Proxies**: Requests starting with `/api` are automatically proxied via `vercel.json` rewrites to the Render server.

### Backend Deployment (Render)
The backend API server runs on Render:
*   **API Endpoint**: [https://qkart-online-store.onrender.com](https://qkart-online-store.onrender.com)
*   **Build Command**: `npm install; npm run build`
*   **Start Command**: `npm run start`
*   **Environment Variables**: Configured with `NODE_ENV=production` and `JWT_SECRET`.

---

## Future Roadmap Improvements

*   **Durable Cloud DB**: Swap the local JSON database file for Google Cloud Firestore or PostgreSQL on Cloud SQL.
*   **Live WebSockets**: Incorporate live client-to-server WebSockets for active warehouse packing and delivery tracking notifications.
*   **Stripes Integration**: Integrate real credit-card merchant platforms for actual purchase options.
*   **Intelligent Grounding**: Ground grocery recommendations based on seasons, weather, or local coordinate preferences using Gemini AI APIs.
