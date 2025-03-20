"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobStore } from "@/stores/jobStore";
import JobFilters from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import { useInView } from "react-intersection-observer";
import { jobsApi } from "@/lib/api/jobs-api";
import { Filter } from "lucide-react";
import Script from "next/script";

// Import GSAP at the component level for client-side usage
// Note: Add GSAP to your project with npm install gsap

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSelectionModeActive, setIsSelectionModeActive] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Reference to the match button for GSAP animation
  const matchButtonRef = useRef(null);
  const gsapLoadedRef = useRef(false);

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

  useEffect(() => {
    if (
      selectedJobs.length > 0 &&
      matchButtonRef.current &&
      typeof window !== "undefined"
    ) {
      // Import GSAP dynamically
      import("gsap").then(({ gsap }) => {
        gsapLoadedRef.current = true;

        // Clear any existing animations
        gsap.killTweensOf(matchButtonRef.current);

        // Create a timeline for the animation sequence
        const tl = gsap.timeline({ paused: true });

        // Add glow effect with CSS
        gsap.set(matchButtonRef.current, {
          boxShadow: "0 0 0 rgba(79, 70, 229, 0.4)",
        });

        // Sequence of animations
        tl.to(matchButtonRef.current, {
          scale: 1.05,
          boxShadow: "0 0 15px rgba(79, 70, 229, 0.7)",
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
            boxShadow: "0 0 0 rgba(79, 70, 229, 0.4)",
            duration: 0.5,
            ease: "power1.inOut",
          });

        // Play the animation
        tl.play();

        // Animation cycle
        const intervalId = setInterval(() => {
          tl.restart();
        }, 5000); // Play every 5 seconds

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
      // Stop animation when no jobs are selected
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

  const toggleJobSelection = (jobId: string) => {
    if (!isSelectionModeActive) return;

    setSelectedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }

      // Only allow up to 5 selections
      if (prev.length >= 5) {
        return prev;
      }

      return [...prev, jobId];
    });
  };

  const toggleSelectionMode = () => {
    setIsSelectionModeActive((prev) => !prev);
    if (isSelectionModeActive) {
      setSelectedJobs([]);
    }
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

    // Convert the array of job IDs to a comma-separated string
    const jobIdsParam = selectedJobs.join(",");

    // Navigate to the match page with the selected job IDs as URL parameter
    router.push(`/match?jobs=${jobIdsParam}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100">
      {/* Script tag to load GSAP from CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          gsapLoadedRef.current = true;
        }}
      />

      {/* Sticky selection button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
        {selectedJobs.length > 0 && (
          <button
            ref={matchButtonRef}
            onClick={handleMatchButtonClick}
            className="flex items-center text-sm space-x-2 py-3 px-5 
  rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 
  text-white transition-all duration-300
  transform-gpu will-change-transform"
          >
            <span>Let&apos;s Match ({selectedJobs.length})</span>
          </button>
        )}

        <button
          onClick={toggleSelectionMode}
          className={`flex items-center text-sm space-x-2 py-3 px-5 rounded-full shadow-lg transition-all duration-300 ${
            isSelectionModeActive
              ? "bg-black hover:bg-gray-900 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900 dark:bg-black dark:hover:bg-gray-900 dark:text-white"
          }`}
        >
          <span>
            {isSelectionModeActive
              ? `Select Jobs (${selectedJobs.length}/5)`
              : "Select Jobs"}
          </span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Next Opportunity
          </h1>

          <button
            className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
              </div>
            ) : Array.isArray(jobs) && jobs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  No jobs found matching your criteria
                </p>
                <button
                  onClick={() => {
                    resetStore();
                    fetchJobs(1);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
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
    </div>
  );
}
