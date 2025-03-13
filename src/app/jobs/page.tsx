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
    resetStore,
  } = useJobStore();

  const fetchJobs = async (page: number, isAppending = false) => {
    if (loading || (isAppending && !hasMore)) return;

    try {
      setLoading(true);

      // Prepare clean filters
      const cleanFilters = {
        page,
        limit: 10,
        ...(filters.searchQuery && { search: filters.searchQuery }),
        ...(filters.jobTypes?.length > 0 && { jobTypes: filters.jobTypes }),
        ...(filters.experienceLevels?.length > 0 && {
          experienceLevels: filters.experienceLevels,
        }),
      };

      const response = await jobsApi.getJobs(cleanFilters);

      if (isAppending) {
        appendJobs(response.jobs);
      } else {
        setJobs(response.jobs);
      }

      setTotalPages(Math.ceil(response.total / 10));
      setHasMore(page < Math.ceil(response.total / 10));
      setCurrentPage(page);

      // Update URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("page", page.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          newParams.set(key, JSON.stringify(value));
        } else if (typeof value === "string" && value) {
          newParams.set(key, value);
        }
      });

      router.push(`/jobs?${newParams.toString()}`, { scroll: false });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchJobs(currentPage + 1, true);
    }
  }, [inView, hasMore, loading]);

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

      fetchJobs(page);
    };

    initializeFromUrl();
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    resetStore();
    setFilters(newFilters);
    fetchJobs(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>

          <button
            className="md:hidden flex items-center space-x-2 px-4 py-2 bg-gray-900 rounded-lg"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 flex-shrink-0">
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobileOpen={isMobileFiltersOpen}
              onMobileClose={() => setIsMobileFiltersOpen(false)}
            />
          </aside>

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
                  onClick={() => {
                    resetStore();
                    fetchJobs(1);
                  }}
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <JobList
                  jobs={jobs}
                  onJobClick={(jobId) => router.push(`/jobs/${jobId}`)}
                />

                {hasMore && (
                  <div ref={ref} className="h-10">
                    {loading && (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto" />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
