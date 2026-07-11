/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
export const JWT_SECRET = process.env.JWT_SECRET || "qkart_super_secret_jwt_key_987654";
export const DB_FILE_PATH = process.env.DB_FILE_PATH || path.join(process.cwd(), "backend", "database", "db.json");
