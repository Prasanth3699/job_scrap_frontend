"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobStore } from "@/stores/jobStore";
import JobFilters from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import { useInView } from "react-intersection-observer";
import { jobsApi } from "@/lib/api/jobs-api";
import { Filter, Sparkles } from "lucide-react";
import Script from "next/script";
import PublicLayout from "@/components/layout/PublicLayout";

// Use a simple debounce util if not already provided elsewhere
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSelectionModeActive, setIsSelectionModeActive] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Filters and store
  const {
    jobs,
    filters,
    loading,
    hasMore,
    currentPage,
    setJobs,
    appendJobs,
    setFilters,
    setLoading,
    setHasMore,
    setCurrentPage,
    setTotalPages,
    resetStore,
  } = useJobStore();

  // Ref for GSAP button animation
  const matchButtonRef = useRef<HTMLButtonElement | null>(null);
  const gsapLoadedRef = useRef(false);

  // --- Filter UI: central input state for 'search', possibly others ---
  // Debounce only searchQuery, NOT the entire filter object!
  const [searchInput, setSearchInput] = useState(filters.searchQuery || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  // ------------------- GSAP Animation Effect -------------------
  useEffect(() => {
    if (
      selectedJobs.length > 0 &&
      matchButtonRef.current &&
      typeof window !== "undefined"
    ) {
      import("gsap").then(({ gsap }) => {
        gsapLoadedRef.current = true;
        gsap.killTweensOf(matchButtonRef.current);
        const tl = gsap.timeline({ paused: true });
        gsap.set(matchButtonRef.current, {
          boxShadow: "0 0 0 rgba(79,70,229,0.4)",
        });
        tl.to(matchButtonRef.current, {
          scale: 1.05,
          boxShadow: "0 0 15px rgba(79,70,229,0.7)",
          duration: 0.5,
          ease: "power1.inOut",
        })
          .to(matchButtonRef.current, {
            x: "+=3",
            y: "-=3",
            duration: 0.05,
            ease: "power1.inOut",
          })
          .to(matchButtonRef.current, {
            x: "-=6",
            y: "+=6",
            duration: 0.1,
            ease: "power1.inOut",
          })
          .to(matchButtonRef.current, {
            x: "+=6",
            y: "-=6",
            duration: 0.1,
            ease: "power1.inOut",
          })
          .to(matchButtonRef.current, {
            x: "-=6",
            y: "+=6",
            duration: 0.1,
            ease: "power1.inOut",
          })
          .to(matchButtonRef.current, {
            x: "+=3",
            y: "-=3",
            duration: 0.05,
            ease: "power1.inOut",
          })
          .to(matchButtonRef.current, {
            x: 0,
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(79,70,229,0.4)",
            duration: 0.5,
            ease: "power1.inOut",
          });
        tl.play();
        const intervalId = setInterval(() => tl.restart(), 5000);
        return () => {
          clearInterval(intervalId);
          gsap.killTweensOf(matchButtonRef.current);
          gsap.set(matchButtonRef.current, {
            x: 0,
            y: 0,
            scale: 1,
            boxShadow: "none",
          });
        };
      });
    } else if (
      selectedJobs.length === 0 &&
      matchButtonRef.current &&
      gsapLoadedRef.current &&
      typeof window !== "undefined"
    ) {
      import("gsap").then(({ gsap }) => {
        gsap.killTweensOf(matchButtonRef.current);
        gsap.set(matchButtonRef.current, {
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: "none",
        });
      });
    }
  }, [selectedJobs]);

  // ---------- Filtering, Fetching, and Infinite Scroll ------------

  // Single fetch function: page + filterObj + append
  const fetchJobs = useCallback(
    async (page: number, filterSet, append = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const cleanFilters = {
          page,
          limit: 10,
          ...(filterSet.searchQuery && { search: filterSet.searchQuery }),
          ...(filterSet.jobTypes?.length > 0 && {
            jobTypes: filterSet.jobTypes,
          }),
          ...(filterSet.experienceLevels?.length > 0 && {
            experienceLevels: filterSet.experienceLevels,
          }),
          ...(filterSet.locations?.length > 0 && {
            locations: filterSet.locations,
          }),
          ...(filterSet.salaryRange && { salaryRange: filterSet.salaryRange }),
        };

        const response = await jobsApi.getJobs(cleanFilters);
        const responseData = response.data || response;
        const { jobs: newJobs, total } = responseData;

        if (append) {
          appendJobs(newJobs);
        } else {
          setJobs(newJobs);
        }

        const totalPages = Math.ceil(total / 10);
        setTotalPages(totalPages);
        setHasMore(page < totalPages);
        setCurrentPage(page);

        // Update URL exactly once per fetch
        const newParams = new URLSearchParams();
        newParams.set("page", page.toString());
        Object.entries(filterSet).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            newParams.set(key, JSON.stringify(value));
          } else if (typeof value === "string" && value) {
            newParams.set(key, value);
          } else if (typeof value === "number") {
            newParams.set(key, value.toString());
          } else if (
            key === "salaryRange" &&
            value &&
            typeof value === "object" &&
            value.min != null &&
            value.max != null
          ) {
            newParams.set(key, JSON.stringify(value));
          }
        });
        router.replace(`/jobs?${newParams.toString()}`, { scroll: false });
      } catch (error) {
        setHasMore(false);
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      appendJobs,
      setHasMore,
      setJobs,
      setLoading,
      setTotalPages,
      setCurrentPage,
      router,
    ]
  );

  // ---------- Effect: On mount, restore from URL filter/pagination ---------
  useEffect(() => {
    const urlFilters: any = {};
    let initialPage = 1;
    if (searchParams) {
      if (searchParams.has("page")) {
        initialPage = parseInt(searchParams.get("page") + "", 10) || 1;
      }
      searchParams.forEach((value, key) => {
        if (key === "page") return;
        try {
          urlFilters[key] = JSON.parse(value);
        } catch {
          urlFilters[key] = value;
        }
      });
    }
    const restoredFilters = {
      searchQuery: urlFilters.searchQuery || "",
      jobTypes: urlFilters.jobTypes || [],
      experienceLevels: urlFilters.experienceLevels || [],
      locations: urlFilters.locations || [],
      salaryRange: urlFilters.salaryRange || null,
    };
    setFilters(restoredFilters); // Set to store
    setSearchInput(restoredFilters.searchQuery); // Set input for sanity
    setJobs([]);
    setCurrentPage(initialPage);
    fetchJobs(initialPage, restoredFilters, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // -------------- Effect: Debounced Search (on search bar) -----------------
  useEffect(() => {
    // Only do anything if value _actually_ changed
    if (debouncedSearch !== filters.searchQuery) {
      // Construct new filter object (preserve other filters)
      const newFilters = { ...filters, searchQuery: debouncedSearch };
      setFilters(newFilters);
      setCurrentPage(1);
      setJobs([]);
      fetchJobs(1, newFilters, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // -------------- Infinite scroll effect (append on inView) --------------
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = currentPage + 1;
      fetchJobs(nextPage, filters, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // -------------- On any filter (not search) change, reset paging --------
  const handleFilterChange = (newFilters) => {
    // If only the searchQuery changed, ignore (debounced effect handles that)
    const { searchQuery, ...rest } = newFilters;
    const { searchQuery: oldSearchQuery, ...oldRest } = filters;
    const filtersRestChanged = JSON.stringify(rest) !== JSON.stringify(oldRest);

    setFilters(newFilters);
    setSearchInput(newFilters.searchQuery || "");
    // Only reset jobs/page if some filter other than input text actually changed.
    if (filtersRestChanged) {
      setJobs([]);
      setCurrentPage(1);
      fetchJobs(1, newFilters, false);
    }
  };

  // --------------------- SELECTION AND NAV LOGIC ------------------------
  const toggleJobSelection = (jobId: string) => {
    if (!isSelectionModeActive) return;
    setSelectedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      if (prev.length >= 5) return prev;
      return [...prev, jobId];
    });
  };
  const toggleSelectionMode = () => {
    setIsSelectionModeActive((prev) => {
      if (prev) setSelectedJobs([]);
      return !prev;
    });
  };
  const handleJobClick = (jobId: string) => {
    if (isSelectionModeActive) {
      toggleJobSelection(jobId);
    } else {
      router.push(`/jobs/${jobId}`);
    }
  };
  const handleMatchButtonClick = () => {
    if (selectedJobs.length === 0) return;
    router.push(`/match?jobs=${selectedJobs.join(",")}`);
  };

  // --------------------------- UI ---------------------------------------
  return (
    <PublicLayout>
      {/* GSAP (CDN) */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          gsapLoadedRef.current = true;
        }}
      />

      {/* Sticky selection buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {selectedJobs.length > 0 && (
          <button
            ref={matchButtonRef}
            onClick={handleMatchButtonClick}
            className="flex items-center text-sm space-x-2 py-3 px-5 
              rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 
              text-white transition-all duration-300 hover:shadow-xl
              transform-gpu will-change-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>Match Jobs ({selectedJobs.length})</span>
          </button>
        )}

        <button
          onClick={toggleSelectionMode}
          className={`flex items-center text-sm space-x-2 py-3 px-5 rounded-full shadow-lg transition-all duration-300 ${
            isSelectionModeActive
              ? "bg-gray-900 hover:bg-gray-800 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
          }`}
        >
          <span>
            {isSelectionModeActive
              ? `Selecting (${selectedJobs.length}/5)`
              : "Select Jobs"}
          </span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Dream Job
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Browse thousands of opportunities tailored for you
            </p>
          </div>
          <button
            className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobileOpen={isMobileFiltersOpen}
              setIsMobileFiltersOpen={setIsMobileFiltersOpen}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
          </aside>
          {/* Main content area */}
          <main className="flex-1">
            {loading && jobs.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
              </div>
            ) : Array.isArray(jobs) && jobs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">
                  No jobs found matching your criteria
                </p>
                <button
                  onClick={() => {
                    resetStore();
                    setSearchInput(""); // clear the filter UI input as well
                    fetchJobs(
                      1,
                      {
                        searchQuery: "",
                        jobTypes: [],
                        experienceLevels: [],
                        locations: [],
                        salaryRange: null,
                      },
                      false
                    );
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                  </p>
                  {isSelectionModeActive && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select up to 5 jobs to compare
                    </p>
                  )}
                </div>
                <JobList
                  jobs={jobs}
                  onJobClick={handleJobClick}
                  isSelectionMode={isSelectionModeActive}
                  selectedJobs={selectedJobs}
                />
                {hasMore && (
                  <div ref={ref} className="h-10">
                    {loading && (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mt-4" />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </PublicLayout>
  );
}
