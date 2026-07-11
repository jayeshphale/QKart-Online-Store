/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRouter from "./routes/index";
import { PORT } from "./config/config";
import { errorHandler } from "./middleware/errorMiddleware";
import { getDatabase } from "./services/dbService";

async function startServer() {
  // Eagerly initialize/generate database if not present
  console.log("Eagerly checking/initializing database...");
  getDatabase();

  const app = express();

  // Enable CORS
  app.use(cors({
    origin: "*",
    credentials: true
  }));

  app.use(express.json());

  // Mount API endpoints
  app.use("/api/v1", apiRouter);

  // Centralized Error Handler
  app.use(errorHandler);

  // Serve Frontend
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode pointing to frontend...");
    const vite = await createViteServer({
      root: path.join(process.cwd(), "frontend"),
      configFile: path.join(process.cwd(), "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from frontend/dist...");
    const distPath = path.join(process.cwd(), "frontend", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QKart backend server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start backend server:", err);
});
