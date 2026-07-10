/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  info: (message: string, ...optionalParams: any[]) => {
    if (!isProduction) {
      console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...optionalParams);
    }
  },
  error: (message: string, error?: any) => {
    // Always log critical failures for quick system diagnostics, but with a highly structured format
    console.error(
      `[ERROR] [${new Date().toISOString()}] ${message}`,
      error instanceof Error ? error.stack || error.message : error || ""
    );
  },
  warn: (message: string, ...optionalParams: any[]) => {
    if (!isProduction) {
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...optionalParams);
    }
  },
  debug: (message: string, ...optionalParams: any[]) => {
    if (!isProduction) {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, ...optionalParams);
    }
  }
};
