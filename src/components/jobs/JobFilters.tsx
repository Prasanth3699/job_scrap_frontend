"use client";

import type { JobFilters } from "@/types";
import {
  X,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  setIsMobileFiltersOpen: (isOpen: boolean) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
}

export default function JobFilters({
  filters,
  onFilterChange,
  isMobileOpen,
  setIsMobileFiltersOpen,
  searchInput,
  setSearchInput,
}: JobFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    experience: true,
  });

  // Toggle section expansion
  const toggleSection = (section: "jobType" | "experience") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle checkbox changes for job types and experience levels
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
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    const emptyFilters: JobFilters = {
      locations: [],
      jobTypes: [],
      experienceLevels: [],
      salaryRange: null,
      searchQuery: "",
    };
    onFilterChange(emptyFilters);
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
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}{" "}
            applied
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </button>
        </div>
      )}

      {/* Job Type */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleSection("jobType")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Job Type
          </h3>
          {expandedSections.jobType ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.jobType && (
          <div className="grid grid-cols-2 gap-2">
            {jobTypes.map((type) => (
              <label
                key={type}
                className={cn(
                  "flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                  filters.jobTypes.includes(type)
                    ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-500/30 text-blue-800 dark:text-white"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <input
                  type="checkbox"
                  checked={filters.jobTypes.includes(type)}
                  onChange={(e) =>
                    handleCheckboxChange("jobTypes", type, e.target.checked)
                  }
                  className="sr-only"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Experience Level */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleSection("experience")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Experience Level
          </h3>
          {expandedSections.experience ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.experience && (
          <div className="grid grid-cols-2 gap-2">
            {experienceLevels.map((level) => (
              <label
                key={level}
                className={cn(
                  "flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition-colors",
                  filters.experienceLevels.includes(level)
                    ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-500/30 text-blue-800 dark:text-white"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
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
                  className="sr-only"
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2.5 mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition-colors font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block sticky top-4 h-[calc(100vh-2rem)]">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Filter Jobs
            </h2>
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
        onClick={() => setIsMobileFiltersOpen(false)}
      >
        <div
          className={cn(
            "fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden",
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Filters
            </h2>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <FilterContent />
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="fixed bottom-6 right-6 md:hidden z-40 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}
    </>
  );
}
