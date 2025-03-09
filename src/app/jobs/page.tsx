"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobStore } from "@/stores/jobStore";
import JobList from "@/components/jobs/JobList";
import JobFilters from "@/components/jobs/JobFilters";
import { useInView } from "react-intersection-observer";
import { jobsApi } from "@/lib/api/jobs-api";
import { Filter } from "lucide-react";
import { useState } from "react";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Destructure all needed state and actions from the store
  const {
    jobs,
    filters,
    loading,
    hasMore,
    currentPage,
    totalPages,
    setJobs,
    appendJobs,
    setFilters,
    setLoading,
    setHasMore,
    setCurrentPage,
    setTotalPages,
  } = useJobStore();

  const fetchJobs = async (page: number, isAppending = false) => {
    if (loading || (!isAppending && !hasMore)) return;

    try {
      setLoading(true);

      const cleanFilters = {
        ...filters,
        page,
        limit: 10,
      };

      const response = await jobsApi.getJobs(cleanFilters);
      const newJobs = Array.isArray(response.jobs) ? response.jobs : [];
      const total = response.total || 0;
      const totalPages = Math.ceil(total / 10);

      setTotalPages(totalPages);
      setHasMore(page < totalPages);

      if (isAppending) {
        appendJobs(newJobs);
      } else {
        setJobs(newJobs);
      }

      setCurrentPage(page);

      // Update URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("page", page.toString());
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (!Array.isArray(value) || value.length > 0)) {
          newParams.set(key, JSON.stringify(value));
        } else {
          newParams.delete(key);
        }
      });
      router.push(`/jobs?${newParams}`, { scroll: false });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchJobs(currentPage + 1, true);
    }
  }, [inView, hasMore, loading, currentPage, totalPages]);

  // Initialize from URL params
  useEffect(() => {
    const initializeFromUrl = () => {
      const urlFilters: any = {};
      const page = parseInt(searchParams.get("page") || "1", 10);

      searchParams.forEach((value, key) => {
        if (key === "page") return;
        try {
          urlFilters[key] = JSON.parse(value);
        } catch {
          urlFilters[key] = value;
        }
      });

      if (Object.keys(urlFilters).length > 0) {
        setFilters(urlFilters);
      }

      setCurrentPage(page);
      fetchJobs(page);
    };

    initializeFromUrl();
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setJobs([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchJobs(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>

          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center space-x-2 px-4 py-2 bg-gray-900 rounded-lg"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobileOpen={isMobileFiltersOpen}
              onMobileClose={() => setIsMobileFiltersOpen(false)}
            />
          </aside>

          {/* Job Listings */}
          <main className="flex-1">
            {loading && jobs.length === 0 ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  No jobs found matching your criteria
                </p>
                <button
                  onClick={() =>
                    handleFilterChange({
                      locations: [],
                      jobTypes: [],
                      experienceLevels: [],
                      salaryRange: null,
                      searchQuery: "",
                    })
                  }
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <JobList
                  jobs={jobs}
                  onJobClick={(jobId) => router.push(`/jobs/${jobId}`)}
                />

                {hasMore && currentPage < totalPages && (
                  <div ref={ref} className="h-10">
                    {loading && (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
