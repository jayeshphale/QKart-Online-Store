/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Smile, ArrowLeft, Home } from "lucide-react";

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fadeIn" id="not-found-page-container">
      <div className="bg-orange-50 dark:bg-orange-950/20 text-orange-500 p-5 rounded-full mb-6">
        <Smile className="w-14 h-14" />
      </div>
      <h1 className="text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-extrabold text-zinc-800 dark:text-zinc-200 mb-2">
        Coordinates Not Found
      </h2>
      <p className="text-xs text-zinc-400 max-w-sm mb-8 leading-relaxed">
        The page you are trying to visit has been shifted, eaten, or does not exist in our QKart organic supermarket database.
      </p>
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <button
          onClick={() => navigate("home")}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/10 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </button>
        <button
          onClick={() => navigate("products")}
          className="px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </button>
      </div>
    </div>
  );
};
