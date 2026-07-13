/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import apiRouter from "./routes/index";
import { PORT } from "./config/config";
import { errorHandler } from "./middleware/errorMiddleware";
import { getDatabase, syncProductsWithDummyJson } from "./services/dbService";

async function startServer() {
  // Eagerly initialize/generate database if not present
  console.log("Eagerly checking/initializing database...");
  getDatabase();

  // Sync products with DummyJSON API
  try {
    await syncProductsWithDummyJson();
    console.log("Successfully loaded live e-commerce products from DummyJSON API!");
  } catch (err: any) {
    console.warn("Could not sync with DummyJSON, using local mock backup products instead:", err.message || err);
  }

  const app = express();

  // Enable CORS with dynamic origin mirroring to support credentials across domains (e.g., Vercel and Render)
  app.use(cors({
    origin: (origin, callback) => {
      // Allow all origins dynamically
      callback(null, true);
    },
    credentials: true
  }));

  app.use(express.json());

  // Mount API endpoints
  app.use("/api/v1", apiRouter);

  // Centralized Error Handler
  app.use(errorHandler);

  // Serve Frontend if available, otherwise serve a welcome message for standalone API server
  const isCwdBackend = process.cwd().endsWith("backend") || process.cwd().endsWith("backend/");
  const distPath = isCwdBackend 
    ? path.join(process.cwd(), "..", "frontend", "dist")
    : path.join(process.cwd(), "frontend", "dist");

  const frontendPath = isCwdBackend ? path.join(process.cwd(), "..", "frontend") : path.join(process.cwd(), "frontend");

  if (process.env.NODE_ENV !== "production" && fs.existsSync(frontendPath)) {
    console.log("Starting Vite in middleware mode pointing to frontend...");
    const configPath = isCwdBackend ? path.join(process.cwd(), "..", "vite.config.ts") : path.join(process.cwd(), "vite.config.ts");
    const rootPath = isCwdBackend ? path.join(process.cwd(), "..", "frontend") : path.join(process.cwd(), "frontend");
    const vite = await createViteServer({
      root: rootPath,
      configFile: configPath,
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (fs.existsSync(distPath)) {
    console.log("Serving static production assets from frontend/dist...");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("No frontend static assets found. Running in standalone API mode.");
    app.get("/", (req, res) => {
      res.json({
        message: "Welcome to QKart Backend API Server",
        status: "healthy",
        apiDocs: "/api/v1"
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QKart backend server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start backend server:", err);
});
