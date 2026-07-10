/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const [localSearch, setLocalSearch] = useState(value);

  // Sync state if parent changes value (e.g. on reset)
  useEffect(() => {
    setLocalSearch(value);
  }, [value]);

  // Debounced effect for 400ms matching standard requirements
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== value) {
        onChange(localSearch);
      }
    }, 450); // 450ms debounce window

    return () => clearTimeout(timer);
  }, [localSearch, onChange, value]);

  const handleClear = () => {
    setLocalSearch("");
    onChange("");
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search for items, categories or descriptions..."
      value={localSearch}
      onChange={(e) => setLocalSearch(e.target.value)}
      id="products-search-bar"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: localSearch && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: "background.paper",
        }
      }}
    />
  );
};
