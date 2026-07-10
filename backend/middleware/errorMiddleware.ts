/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../services/loggerService";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected error occurred on the server.";
  
  // Log the error centrally using our logger service
  logger.error(`API Error on [${req.method}] ${req.path}: Status ${status} - ${message}`, err);

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}
