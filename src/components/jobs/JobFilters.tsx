"use client";

import { useEffect, useState, useCallback } from "react";
import type { JobFilters } from "@/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

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
  const handleCheckboxChange = (
    category: keyof JobFilters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (filters[category] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onFilterChange({
        ...filters,
        searchQuery: value,
      });
    }, 500),
    [filters, onFilterChange]
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Search</h3>
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          value={filters.searchQuery}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      {/* Job Type */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Job Type</h3>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.jobTypes.includes(type)}
                onChange={(e) =>
                  handleCheckboxChange("jobTypes", type, e.target.checked)
                }
                className="form-checkbox bg-gray-800 border-gray-700 text-blue-500"
              />
              <span className="text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">
          Experience Level
        </h3>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <label key={level} className="flex items-center space-x-2">
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
                className="form-checkbox bg-gray-800 border-gray-700 text-blue-500"
              />
              <span className="text-gray-300">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() =>
          onFilterChange({
            locations: [],
            jobTypes: [],
            experienceLevels: [],
            salaryRange: null,
            searchQuery: "",
          })
        }
        className="w-full py-2 mt-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block sticky top-4 h-[calc(100vh-2rem)]">
        <div className="bg-gray-900 rounded-lg h-full overflow-hidden flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
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
            "fixed inset-y-0 right-0 w-full max-w-xs bg-gray-900 transform transition-transform duration-300 ease-in-out flex flex-col",
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button
                onClick={onMobileClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <FilterContent />
          </div>
        </div>
      </div>
    </>
  );
}
