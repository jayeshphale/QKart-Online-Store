/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  SelectChangeEvent
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Sort as SortIcon
} from "@mui/icons-material";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange
}) => {
  const handleSortSelect = (event: SelectChangeEvent) => {
    onSortChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        gap: 2,
        my: 2
      }}
      id="products-filter-bar-container"
    >
      {/* Categories chips list */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontWeight: "bold",
            color: "text.secondary",
            textTransform: "uppercase",
            mb: 1
          }}
        >
          <FilterIcon sx={{ fontSize: 16 }} />
          Filter by Category
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            pb: { xs: 1, md: 0 }
          }}
          id="category-chips-wrapper"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => onCategoryChange(cat)}
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  fontWeight: isSelected ? "bold" : "medium",
                  borderRadius: 2,
                  px: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)"
                  },
                  // Explicitly set colors to ensure absolute visibility under any CSS override
                  color: isSelected ? "#ffffff" : "text.primary",
                  backgroundColor: isSelected ? "primary.main" : "background.paper",
                  borderColor: isSelected ? "primary.main" : "text.secondary",
                  "& .MuiChip-label": {
                    color: isSelected ? "#ffffff" : "text.primary",
                  }
                }}
                id={`category-chip-${cat.replace(/\s+/g, "-")}`}
              />
            );
          })}
        </Box>
      </Box>

      {/* Sorting Control */}
      <Box sx={{ minWidth: { xs: "100%", md: 200 } }}>
        <Typography
          variant="caption"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontWeight: "bold",
            color: "text.secondary",
            textTransform: "uppercase",
            mb: 1
          }}
        >
          <SortIcon sx={{ fontSize: 16 }} />
          Sort Options
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="products-sort-select-label">Sort by</InputLabel>
          <Select
            labelId="products-sort-select-label"
            id="products-sort-select"
            value={selectedSort}
            label="Sort by"
            onChange={handleSortSelect}
            sx={{ borderRadius: 3, bgcolor: "background.paper" }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="rating_desc">Rating: Highest First</MenuItem>
            <MenuItem value="newest">Newest Added</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
