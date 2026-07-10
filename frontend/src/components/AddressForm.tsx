/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Plus, Check, X, Loader2 } from "lucide-react";

interface AddressFormProps {
  initialValue?: string;
  isEditMode?: boolean;
  isSubmitting?: boolean;
  onSubmit: (address: string) => Promise<boolean>;
  onCancelEdit?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialValue = "",
  isEditMode = false,
  isSubmitting = false,
  onSubmit,
  onCancelEdit,
}) => {
  const [addressText, setAddressText] = useState(initialValue);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    setAddressText(initialValue);
    setErrorText(null);
  }, [initialValue]);

  const validateAddress = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) {
      setErrorText("Address cannot be empty.");
      return false;
    }
    if (trimmed.length < 10) {
      setErrorText("Address must contain at least 10 characters.");
      return false;
    }
    setErrorText(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress(addressText)) {
      return;
    }

    const success = await onSubmit(addressText.trim());
    if (success) {
      setAddressText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2" id="checkout-address-form">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
          {isEditMode ? "Modify Shipping Address" : "Add Shipping Address"}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Type complete shipping address (e.g., 10 Downing Street, London, SW1A 2AA)..."
            value={addressText}
            onChange={(e) => {
              setAddressText(e.target.value);
              if (errorText) setErrorText(null);
            }}
            className={`flex-1 p-3 border rounded-xl text-xs outline-none transition-all ${
              errorText
                ? "border-rose-400 dark:border-rose-900/60 bg-rose-50/10 focus:border-rose-500"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 focus:border-orange-500"
            }`}
            id="checkout-new-address-input"
            disabled={isSubmitting}
            required
          />
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              id="add-address-btn"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isEditMode ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>{isEditMode ? "Save Changes" : "Save Address"}</span>
            </button>

            {isEditMode && onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={isSubmitting}
                className="px-3 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                id="cancel-edit-address-btn"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {errorText && (
        <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400 leading-none mt-0.5" id="address-validation-error">
          ⚠️ {errorText}
        </span>
      )}
    </form>
  );
};
