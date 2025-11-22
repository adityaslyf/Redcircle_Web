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
      <div className="flex items-center gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-2xl border-white/5 bg-neutral-900/50 pl-11 pr-11 text-sm text-white placeholder:text-white/30 focus:border-white/10 focus:bg-neutral-900 focus:ring-0 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        {showFilters && (
          <Button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            variant="ghost"
            className={cn(
              "h-12 rounded-2xl border border-white/5 bg-neutral-900/50 px-6 text-sm text-white/70 hover:bg-neutral-900 hover:text-white hover:border-white/10 transition-all",
              showAdvancedFilters && "bg-neutral-900 border-white/10 text-white",
              hasActiveFilters && "text-purple-400 border-purple-500/20 bg-purple-500/10"
            )}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                {[query, filters.subreddit, filters.author, filters.minPrice, filters.maxPrice, filters.minVolume, filters.minMarketCap].filter(Boolean).length}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Sort Options (Always Visible) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-sm text-white/40 font-medium">Sort:</span>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = filters.sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setFilters({ ...filters, sortBy: option.value as any })}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]"
                    : "border-white/5 bg-neutral-900/30 text-white/50 hover:border-white/10 hover:bg-neutral-900/50 hover:text-white/80"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-purple-400" : "text-white/40")} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Clear Filters (only if active) */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto text-xs text-white/40 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-3xl border border-white/5 bg-neutral-900/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-8 text-xs text-white/40 hover:text-white hover:bg-white/5"
                  >
                    Reset all
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Subreddit Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Subreddit
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., cryptocurrency"
                    value={filters.subreddit || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, subreddit: e.target.value || undefined })
                    }
                    className="h-10 rounded-xl border-white/5 bg-black/20 text-sm text-white placeholder:text-white/20 focus:border-white/10 focus:bg-black/40"
                  />
                </div>

                {/* Author Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Author
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., username"
                    value={filters.author || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, author: e.target.value || undefined })
                    }
                    className="h-10 rounded-xl border-white/5 bg-black/20 text-sm text-white placeholder:text-white/20 focus:border-white/10 focus:bg-black/40"
                  />
                </div>

                {/* Tags Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Tags
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., crypto"
                    value={filters.tags || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, tags: e.target.value || undefined })
                    }
                    className="h-10 rounded-xl border-white/5 bg-black/20 text-sm text-white placeholder:text-white/20 focus:border-white/10 focus:bg-black/40"
                  />
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Price Range (SOL)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="Min"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="h-10 rounded-xl border-white/5 bg-black/20 text-sm text-white placeholder:text-white/20 focus:border-white/10 focus:bg-black/40"
                    />
                    <span className="text-white/20">-</span>
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="Max"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="h-10 rounded-xl border-white/5 bg-black/20 text-sm text-white placeholder:text-white/20 focus:border-white/10 focus:bg-black/40"
                    />
                  </div>
                </div>

                {/* Min Volume */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
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
                    className="h-10 rounded-xl border-white/5 bg-black/20 text-sm text-white placeholder:text-white/20 focus:border-white/10 focus:bg-black/40"
                  />
                </div>

                {/* Min Market Cap */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
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
                    className="h-10 rounded-xl border-white/5 bg-black/20 text-sm text-white placeholder:text-white/20 focus:border-white/10 focus:bg-black/40"
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

