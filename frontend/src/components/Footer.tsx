/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Sparkles, 
  Mail, 
  MapPin, 
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Lock
} from "lucide-react";

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 transition-colors duration-200">
      
      {/* Upper Features Bar */}
      <div className="border-b border-zinc-900 bg-zinc-900/40 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2 bg-zinc-800 rounded-full text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-zinc-100">100% Secure Payments</h5>
              <p className="text-xs text-zinc-500">Encrypted checkout with SSL security</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2 bg-zinc-800 rounded-full text-amber-500">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-zinc-100">Easy Returns & Refunds</h5>
              <p className="text-xs text-zinc-500">Hassle-free 10-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2 bg-zinc-800 rounded-full text-amber-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-zinc-100">Cash on Delivery</h5>
              <p className="text-xs text-zinc-500">Pay at your doorstep with COD option</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2 bg-zinc-800 rounded-full text-amber-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-zinc-100">QKart Guarantee</h5>
              <p className="text-xs text-zinc-500">100% genuine products directly sourced</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate("home")}>
              <div className="bg-gradient-to-tr from-amber-400 to-amber-500 text-zinc-950 font-extrabold p-1.5 rounded-lg text-sm shadow-md">
                QK
              </div>
              <span className="text-2xl font-black text-white hover:text-amber-400 transition-colors">
                QKart<span className="text-amber-500 text-xs font-normal ml-0.5">Market</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              QKart is a premier, responsive multi-category e-commerce marketplace. Shop smartphones, electronics, high-power workstations, apparel, home appliances, books, furniture, and daily essentials with our brand partners.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-2">
              {[
                { icon: Facebook, color: "hover:text-blue-500 hover:bg-blue-500/10" },
                { icon: Instagram, color: "hover:text-pink-500 hover:bg-pink-500/10" },
                { icon: Linkedin, color: "hover:text-sky-500 hover:bg-sky-500/10" },
                { icon: Twitter, color: "hover:text-sky-400 hover:bg-sky-400/10" },
                { icon: Youtube, color: "hover:text-red-500 hover:bg-red-500/10" }
              ].map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={idx}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={`p-2 rounded-lg bg-zinc-900 text-zinc-500 transition-all duration-300 ${s.color}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 1: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-500">
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">About QKart</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Careers</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Press Releases</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Investor Relations</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">QKart Science</span></li>
            </ul>
          </div>

          {/* Column 2: Help & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Help & Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-500">
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Contact Support</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Shipping & Delivery</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Returns & Exchanges</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Refund Policies</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">QKart Assistant</span></li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Policies
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-500">
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Terms of Use</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Cookie Preferences</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Interest-Based Ads</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">E-Waste Management</span></li>
            </ul>
          </div>

        </div>

        <hr className="border-zinc-900 my-10" />

        {/* Footer Bottom (Payment badges, Copyright) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-zinc-600 text-center md:text-left leading-normal">
            <div>
              &copy; {new Date().getFullYear()} QKart Marketplaces Inc. All Rights Reserved.
            </div>
            <div className="mt-1">
              Registered Office: 100 E-Commerce Dr, Silicon Valley, CA 94043. CIN: U72900KA2026PTC999999.
            </div>
          </div>

          {/* Payment gateway partners indicators */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Our Trusted Payment Partners</span>
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-end opacity-40 hover:opacity-75 transition-opacity duration-300">
              {["Visa", "Mastercard", "RuPay", "UPI", "NetBanking", "COD"].map((pay, idx) => (
                <span 
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded text-[10px] font-extrabold tracking-tight"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
