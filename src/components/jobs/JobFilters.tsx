"use client";

import { useEffect, useState, useRef } from "react";
import type { JobFilters } from "@/types";
import { X, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior",
  "Lead",
  "Executive",
];

interface JobFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function JobFilters({
  filters,
  onFilterChange,
  isMobileOpen,
  onMobileClose,
}: JobFiltersProps) {
  const [inputValue, setInputValue] = useState(filters.searchQuery || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle URL sync with filters
  const updateURL = (newFilters: JobFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update search query in URL
    if (newFilters.searchQuery) {
      params.set("q", newFilters.searchQuery);
    } else {
      params.delete("q");
    }

    // Update job types in URL
    if (newFilters.jobTypes && newFilters.jobTypes.length > 0) {
      params.set("types", newFilters.jobTypes.join(","));
    } else {
      params.delete("types");
    }

    // Update experience levels in URL
    if (newFilters.experienceLevels && newFilters.experienceLevels.length > 0) {
      params.set("exp", newFilters.experienceLevels.join(","));
    } else {
      params.delete("exp");
    }

    // Update locations in URL
    if (newFilters.locations && newFilters.locations.length > 0) {
      params.set("loc", newFilters.locations.join(","));
    } else {
      params.delete("loc");
    }

    // Update salary range in URL
    if (newFilters.salaryRange) {
      params.set("salary", newFilters.salaryRange.toString());
    } else {
      params.delete("salary");
    }

    // Update the URL
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle search with proper debouncing
  const handleSearchChange = (value: string) => {
    setInputValue(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to update the filter after 500ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      const newFilters = {
        ...filters,
        searchQuery: value,
      };
      onFilterChange(newFilters);
      updateURL(newFilters);
    }, 500);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Sync filters to input value when filters change externally
  useEffect(() => {
    setInputValue(filters.searchQuery || "");
  }, [filters.searchQuery]);

  const handleCheckboxChange = (
    category: keyof JobFilters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (filters[category] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    const newFilters = {
      ...filters,
      [category]: newValues,
    };

    onFilterChange(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    setInputValue("");
    const emptyFilters = {
      locations: [],
      jobTypes: [],
      experienceLevels: [],
      salaryRange: null,
      searchQuery: "",
    };

    onFilterChange(emptyFilters);
    updateURL(emptyFilters);
  };

  // Count active filters for badge display
  const activeFilterCount =
    (filters.jobTypes?.length || 0) +
    (filters.experienceLevels?.length || 0) +
    (filters.locations?.length || 0) +
    (filters.searchQuery ? 1 : 0) +
    (filters.salaryRange ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          {inputValue && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
          <span className="text-gray-300 text-sm">
            {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}{" "}
            applied
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </button>
        </div>
      )}

      {/* Job Type */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Job Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {jobTypes.map((type) => (
            <label
              key={type}
              className={cn(
                "flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                filters.jobTypes.includes(type)
                  ? "bg-blue-900/40 border-blue-500/30 text-white"
                  : "border-gray-700 text-gray-300 hover:border-gray-600"
              )}
            >
              <input
                type="checkbox"
                checked={filters.jobTypes.includes(type)}
                onChange={(e) =>
                  handleCheckboxChange("jobTypes", type, e.target.checked)
                }
                className="sr-only" // Hide the checkbox visually
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">
          Experience Level
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {experienceLevels.map((level) => (
            <label
              key={level}
              className={cn(
                "flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                filters.experienceLevels.includes(level)
                  ? "bg-blue-900/40 border-blue-500/30 text-white"
                  : "border-gray-700 text-gray-300 hover:border-gray-600"
              )}
            >
              <input
                type="checkbox"
                checked={filters.experienceLevels.includes(level)}
                onChange={(e) =>
                  handleCheckboxChange(
                    "experienceLevels",
                    level,
                    e.target.checked
                  )
                }
                className="sr-only" // Hide the checkbox visually
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 mt-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors sticky bottom-0"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block sticky top-4 max-h-[calc(100vh-2rem)]">
        <div className="bg-black rounded-lg border border-gray-800 overflow-hidden flex flex-col">
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <FilterContent />
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 right-0 w-full max-w-xs bg-black transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden",
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Filters</h2>
            <button
              onClick={onMobileClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <FilterContent />
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <button
        onClick={onMobileClose}
        className="fixed bottom-4 right-4 md:hidden z-40 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>
    </>
  );
}
