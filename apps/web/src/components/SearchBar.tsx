import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X, TrendingUp, Clock, DollarSign, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SearchFilters = {
  q?: string;
  subreddit?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  minMarketCap?: number;
  tags?: string;
  sortBy?: "trending" | "new" | "price" | "volume" | "marketCap";
};

type SearchBarProps = {
  onSearch: (filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
};

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  showFilters = true,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "trending",
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Always call onSearch, even with empty query (to reset to all posts)
      const searchFilters = { ...filters, q: query || undefined };
      
      // Remove undefined values
      Object.keys(searchFilters).forEach(key => {
        if (searchFilters[key as keyof SearchFilters] === undefined) {
          delete searchFilters[key as keyof SearchFilters];
        }
      });
      
      onSearch(searchFilters);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, filters, onSearch]);

  const handleClearFilters = () => {
    setQuery("");
    setFilters({ sortBy: "trending" });
    setShowAdvancedFilters(false);
    onSearch({ sortBy: "trending" });
  };

  const hasActiveFilters = query || filters.subreddit || filters.author || filters.minPrice || filters.maxPrice || filters.minVolume || filters.minMarketCap;

  const sortOptions = [
    { value: "trending", label: "Trending", icon: TrendingUp },
    { value: "new", label: "New", icon: Clock },
    { value: "price", label: "Price", icon: DollarSign },
    { value: "volume", label: "Volume", icon: BarChart3 },
    { value: "marketCap", label: "Market Cap", icon: BarChart3 },
  ];

  return (
    <div className={cn("w-full", className)}>
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2 sm:left-4 top-1/2 h-3 w-3 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 sm:h-14 rounded-lg sm:rounded-2xl border-white/10 bg-white/5 pl-8 sm:pl-12 pr-8 sm:pr-12 text-xs sm:text-base text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Filter Toggle */}
          {showFilters && (
            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="outline"
              className={cn(
                "h-8 sm:h-14 rounded-lg sm:rounded-2xl border-white/10 bg-white/5 px-2 sm:px-6 transition-colors hover:bg-white/10 flex-1 sm:flex-none",
                showAdvancedFilters && "bg-white/10 border-white/20"
              )}
            >
              <Filter className="h-3 w-3 sm:h-5 sm:w-5" />
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-base">Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 sm:ml-2 flex h-3 w-3 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-purple-500 text-[8px] sm:text-xs font-bold text-white">
                  {[query, filters.subreddit, filters.author, filters.minPrice, filters.maxPrice, filters.minVolume, filters.minMarketCap].filter(Boolean).length}
                </span>
              )}
            </Button>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              className="h-8 sm:h-14 rounded-lg sm:rounded-2xl px-2 sm:px-4 text-[10px] sm:text-base text-white/60 hover:text-white"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Sort Options (Always Visible) */}
      <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
        <span className="text-[10px] sm:text-sm text-white/60 whitespace-nowrap">Sort:</span>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setFilters({ ...filters, sortBy: option.value as any })}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 rounded-md sm:rounded-xl border border-white/10 bg-white/5 px-1.5 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm transition-all",
                  filters.sortBy === option.value
                    ? "border-purple-500/50 bg-purple-500/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 sm:mt-4 rounded-lg sm:rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-6 backdrop-blur-xl">
              <h3 className="mb-2 sm:mb-4 text-xs sm:text-lg font-semibold text-white">Advanced Filters</h3>
              
              <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Subreddit Filter */}
                <div>
                  <label className="mb-1 sm:mb-2 block text-[10px] sm:text-sm font-medium text-white/70">
                    Subreddit
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., cryptocurrency"
                    value={filters.subreddit || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, subreddit: e.target.value || undefined })
                    }
                    className="h-8 sm:h-11 rounded-md sm:rounded-xl border-white/10 bg-white/5 text-xs sm:text-base text-white placeholder:text-white/40"
                  />
                </div>

                {/* Author Filter */}
                <div>
                  <label className="mb-1 sm:mb-2 block text-[10px] sm:text-sm font-medium text-white/70">
                    Author
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., username"
                    value={filters.author || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, author: e.target.value || undefined })
                    }
                    className="h-8 sm:h-11 rounded-md sm:rounded-xl border-white/10 bg-white/5 text-xs sm:text-base text-white placeholder:text-white/40"
                  />
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="mb-1 sm:mb-2 block text-[10px] sm:text-sm font-medium text-white/70">
                    Tags
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., crypto"
                    value={filters.tags || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, tags: e.target.value || undefined })
                    }
                    className="h-8 sm:h-11 rounded-md sm:rounded-xl border-white/10 bg-white/5 text-xs sm:text-base text-white placeholder:text-white/40"
                  />
                </div>

                {/* Min Price */}
                <div>
                  <label className="mb-1 sm:mb-2 block text-[10px] sm:text-sm font-medium text-white/70">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.001"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="h-8 sm:h-11 rounded-md sm:rounded-xl border-white/10 bg-white/5 text-xs sm:text-base text-white placeholder:text-white/40"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="mb-1 sm:mb-2 block text-[10px] sm:text-sm font-medium text-white/70">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="1.0"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="h-8 sm:h-11 rounded-md sm:rounded-xl border-white/10 bg-white/5 text-xs sm:text-base text-white placeholder:text-white/40"
                  />
                </div>

                {/* Min Volume */}
                <div>
                  <label className="mb-1 sm:mb-2 block text-[10px] sm:text-sm font-medium text-white/70">
                    Min Volume
                  </label>
                  <Input
                    type="number"
                    step="1"
                    placeholder="100"
                    value={filters.minVolume || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minVolume: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="h-8 sm:h-11 rounded-md sm:rounded-xl border-white/10 bg-white/5 text-xs sm:text-base text-white placeholder:text-white/40"
                  />
                </div>

                {/* Min Market Cap */}
                <div>
                  <label className="mb-1 sm:mb-2 block text-[10px] sm:text-sm font-medium text-white/70">
                    Min Market Cap
                  </label>
                  <Input
                    type="number"
                    step="100"
                    placeholder="1000"
                    value={filters.minMarketCap || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minMarketCap: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="h-8 sm:h-11 rounded-md sm:rounded-xl border-white/10 bg-white/5 text-xs sm:text-base text-white placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

