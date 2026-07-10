/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Edit2, Trash2 } from "lucide-react";

interface AddressListProps {
  addresses: string[];
  selectedAddressIndex: number;
  onSelectAddress: (index: number) => void;
  onEditAddress: (index: number, currentText: string) => void;
  onDeleteAddress: (index: number) => void;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddressIndex,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
}) => {
  if (addresses.length === 0) {
    return (
      <div className="text-xs font-semibold text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 p-4 rounded-2xl flex flex-col items-center text-center gap-1.5" id="no-addresses-alert">
        <MapPin className="w-5 h-5 text-amber-500" />
        <span>No saved delivery addresses found. Please add a shipping address below to proceed.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1" id="saved-addresses-grid">
      {addresses.map((addr, idx) => {
        const isSelected = selectedAddressIndex === idx;
        return (
          <div
            key={idx}
            onClick={() => onSelectAddress(idx)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none relative group ${
              isSelected
                ? "border-orange-500 bg-orange-50/10 dark:bg-orange-950/10 shadow-sm"
                : "border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
            id={`address-box-${idx}`}
          >
            {/* Selection indicator */}
            <div
              className={`w-4.5 h-4.5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                isSelected
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
              }`}
            >
              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>

            <div className="flex-1 min-w-0 pr-12">
              <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 block uppercase mb-1 tracking-wider">
                Address #{idx + 1}
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed break-words">
                {addr}
              </p>
            </div>

            {/* Quick Action buttons */}
            <div className="absolute right-3 top-3 flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditAddress(idx, addr);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                title="Edit Address"
                id={`edit-address-btn-${idx}`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAddress(idx);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                title="Delete Address"
                id={`delete-address-btn-${idx}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
