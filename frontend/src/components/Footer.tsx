/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/60 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate("home")}>
              <div className="bg-orange-500 text-white font-extrabold p-1 rounded-md text-sm">
                QK
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                QKart
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your premium neighborhood online supermarket. We deliver organic produce, fresh artisanal bakery goodies, chilling beverages, and daily essentials right to your doorstep.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Super Fast 1-Day Delivery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Explore QKart
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <button 
                  onClick={() => navigate("products")} 
                  className="text-zinc-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 text-left transition-colors cursor-pointer"
                >
                  Browse Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("login")} 
                  className="text-zinc-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 text-left transition-colors cursor-pointer"
                >
                  Member Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("register")} 
                  className="text-zinc-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 text-left transition-colors cursor-pointer"
                >
                  Create Free Account
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Policies & Legal
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <span className="text-zinc-500 dark:text-zinc-400 hover:text-orange-500 cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-zinc-500 dark:text-zinc-400 hover:text-orange-500 cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-zinc-500 dark:text-zinc-400 hover:text-orange-500 cursor-pointer transition-colors">
                  Return & Cancellation
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>100 E-Commerce Dr, Innovation Hub, Silicon Valley, CA 94043</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:support@qkart.com" className="hover:underline">support@qkart.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+1 (800) 555-QCRT</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-zinc-200 dark:border-zinc-900 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} QKart Supermarket Inc. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">About</span>
            <span>&middot;</span>
            <span className="hover:underline cursor-pointer">Contact</span>
            <span>&middot;</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>&middot;</span>
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
