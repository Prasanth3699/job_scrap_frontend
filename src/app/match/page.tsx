"use client";

// --- React & Next.js Imports ---
import React, { useEffect, useState, ReactNode, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// --- Library Imports ---
import { get, set, del } from "idb-keyval";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// --- Lucide Icons ---
import {
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  LoaderCircle,
  RefreshCw, // Icon for retry/reload
} from "lucide-react";

// --- Local Imports ---
import PublicLayout from "@/components/layout/PublicLayout";
import { jobsApi } from "@/lib/api/jobs-api";
import { FileUpload } from "@/components/ui/file-upload";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Job } from "@/types";
import { useResumeAnalysis } from "@/hooks/ml/use-resume-analysis";
import { useAnalysisStore } from "@/stores/analysis-store";
import Link from "next/link";

// --- Dynamic Component Imports ---
// Keep the specific loading components for better feedback
const PDFViewer = dynamic(() => import("@/components/resume/PDFViewer"), {
  ssr: false,
  loading: () => <ResumeLoading type="PDF" />,
});
const DocxViewer = dynamic(() => import("@/components/resume/DocxViewer"), {
  ssr: false,
  loading: () => <ResumeLoading type="DOCX" />,
});
const TextViewer = dynamic(() => import("@/components/resume/TextViewer"), {
  ssr: false,
  loading: () => <ResumeLoading type="Text" />,
});

// --- Helper Components ---
const ResumeLoading = ({ type }: { type?: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6">
    <LoaderCircle className="h-12 w-12 text-blue-600 animate-spin mb-4" />
    <p className="text-neutral-400">
      Loading {type ? `${type} ` : ""}resume preview...
    </p>
  </div>
);
const UnsupportedFileType = ({ fileName }: { fileName: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6 text-center">
    <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
    <p className="text-white font-medium mb-2">Preview Not Available</p>
    <p className="text-neutral-400 max-w-xs">
      Preview isn&apos;t supported for &quot;{fileName}&quot;, but you can still
      analyze it. Supported formats include PDF, DOCX, and TXT.
    </p>
  </div>
);
const JobCard = ({ job }: { job: Job }) => {
  // Use ID primarily, fallback to title only if ID is missing/undefined
  const jobKey = job?.id ?? `job-${job?.job_title ?? Math.random()}`;
  // Basic check if job data seems usable
  if (!job?.job_title && !job?.company_name) return null;

  return (
    <div
      key={jobKey}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4 hover:border-neutral-700 transition-colors duration-200"
    >
      <h3 className="text-lg text-white font-medium mb-2">
        {job.job_title || "Untitled Position"}
      </h3>
      <div className="flex items-center mb-2">
        <div className="mr-2 h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
          {/* Ensure company_name exists before charAt */}
          <span className="text-xs text-white">
            {job.company_name?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
        <span className="text-neutral-300 truncate">
          {job.company_name || "Unknown Company"}
        </span>
      </div>
      <div className="text-sm text-neutral-400 space-y-1">
        {job.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}
        {job.job_type && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.job_type}</span>
          </div>
        )}
      </div>
    </div>
  );
};
const NoResume = ({ onUploadClick }: { onUploadClick: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6 text-center">
    <FileText className="h-12 w-12 text-blue-500 mb-4" />
    <p className="text-white font-medium mb-2">No Resume Found</p>
    <p className="text-neutral-400 mb-6 max-w-xs">
      Upload your resume to see how it matches.
    </p>
    <ShinyButton
      onClick={onUploadClick}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity duration-200"
    >
      Upload Resume
    </ShinyButton>
  </div>
);
const ResumeError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-red-800/50 p-6 text-center">
    <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
    <p className="text-white font-medium mb-2">Error Loading Resume</p>
    <p className="text-neutral-400 mb-6 max-w-xs">
      Could not load the resume from local storage. It might be corrupted or
      missing. Please try loading again or upload a new one.
    </p>
    <ShinyButton
      onClick={onRetry}
      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:opacity-90 transition-opacity duration-200 flex items-center gap-2"
    >
      <RefreshCw size={16} /> Retry Load
    </ShinyButton>
  </div>
);

// --- Main Page Component ---
export default function MatchPage() {
  // --- Hooks ---
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setResults, setJobIds } = useAnalysisStore();
  const { analyzeResume, isAnalyzing } = useResumeAnalysis();

  // --- State ---
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingResume, setIsLoadingResume] = useState(true); // Separate loading for resume
  const [resume, setResume] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<boolean>(false); // State for resume loading errors

  // --- Load Job Data Effect ---
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoadingJobs(true);
      setSelectedJobs([]); // Clear previous
      try {
        const jobIdsParam = searchParams.get("jobs");
        const jobIds = jobIdsParam
          ? jobIdsParam.split(",").filter((id) => id.trim() !== "")
          : [];

        if (jobIds.length === 0) {
          console.warn("MatchPage: No job IDs found in URL parameters.");
          // Still allow page load, maybe user will upload resume first
        }

        // Only fetch if there are IDs
        let validJobsData: Job[] = [];
        if (jobIds.length > 0) {
          const jobPromises = jobIds.map((id) =>
            jobsApi.getJobById(id).catch((err) => {
              console.error(`MatchPage: Failed to fetch job ${id}:`, err);
              toast.error(`Could not load details for job ID ${id}.`);
              return null; // Return null on error
            })
          );
          const jobsResponses = await Promise.all(jobPromises);
          // Filter out nulls and ensure the response looks like a valid Job object
          validJobsData = jobsResponses.filter(
            (response): response is Job =>
              response !== null &&
              typeof response === "object" &&
              !!response.id &&
              !!response.job_title
          );
        }

        setSelectedJobs(validJobsData);
        // Store the valid job IDs for analysis if needed later
        setJobIds(validJobsData.map((j) => String(j.id)).join(","));
      } catch (error) {
        console.error("MatchPage: Unexpected error loading jobs:", error);
        toast.error("An error occurred while loading job data.");
      } finally {
        setIsLoadingJobs(false);
      }
    };
    loadJobs();
    // Only re-run if searchParams change
  }, [searchParams, setJobIds]); // Removed router from dependencies

  // --- Load Resume Data Effect (runs independently) ---
  const loadResumeFromDB = useCallback(async () => {
    setIsLoadingResume(true);
    setResumeError(false); // Reset error state
    setResume(null); // Clear current resume while loading
    try {
      // Explicitly type the expected data for clarity, though validation is key
      const storedData = await get<File | unknown>("resume");

      if (storedData instanceof File) {
        setResume(storedData); // Set the state
      } else {
        if (storedData !== undefined && storedData !== null) {
          // If data exists but isn't a File, delete it.
          console.warn(
            "MatchPage: Data in IDB 'resume' key is not a File object. Deleting invalid entry."
          );
          await del("resume").catch((delErr) =>
            console.error("Failed to delete invalid resume entry:", delErr)
          );
        }
        setResume(null);
      }
    } catch (idbError) {
      console.error(
        "MatchPage: Error accessing IndexedDB for resume:",
        idbError
      );
      toast.error("Could not load resume from local storage.");
      setResumeError(true); // Set error state
      setResume(null);
    } finally {
      setIsLoadingResume(false);
    }
  }, []); // useCallback ensures this function reference is stable

  // Run resume loading on initial mount
  useEffect(() => {
    loadResumeFromDB();
  }, [loadResumeFromDB]);

  // --- Event Handlers ---
  const handleFileSelection = (files: File[]) => {
    const file = files[0];
    setTempFile(file || null);
  };

  const handleSaveFile = async () => {
    if (!tempFile) return;
    setIsLoadingResume(true); // Show loading indicator while saving/reloading
    setShowUploadForm(false); // Hide form immediately for better UX
    setTempFile(null); // Clear temp file
    try {
      await set("resume", tempFile);
      setResume(tempFile); // Update state directly with the new file
      setResumeError(false); // Clear any previous error
      toast.success("Resume updated successfully!");
    } catch (error) {
      console.error("MatchPage: Error saving resume:", error);
      toast.error("Failed to save resume. Please try again.");
      setResumeError(true); // Indicate an error occurred
      // Optionally reload the previous state if save fails? Or prompt user?
      // For simplicity, we leave the UI potentially showing the error state.
    } finally {
      // Ensure loading state is turned off *after* potential state updates
      // Use a small timeout to allow UI to potentially update before removing loader
      setTimeout(() => setIsLoadingResume(false), 100);
    }
  };

  const handleUploadClick = () => {
    setShowUploadForm(true);
    setTempFile(null); // Clear any previous temp file when opening form
  };

  const handleAnalyze = async () => {
    if (!resume) {
      toast.error("Please upload or load a resume first.");
      handleUploadClick(); // Prompt upload
      return;
    }
    if (selectedJobs.length === 0) {
      toast.error("No jobs selected for analysis. Please select jobs first.");
      // Maybe redirect to jobs page?
      // router.push("/jobs");
      return;
    }

    const numericJobIds = selectedJobs
      .map((job) => Number(job.id))
      .filter((id) => !isNaN(id) && id > 0); // Ensure valid numbers

    if (numericJobIds.length !== selectedJobs.length) {
      console.warn("Some selected jobs have invalid IDs.", selectedJobs);
      toast.warning(
        "Some selected jobs seem to be missing valid IDs. Proceeding with valid ones."
      );
    }

    if (numericJobIds.length === 0) {
      toast.error("No valid job IDs found for the selected jobs.");
      return;
    }

    const jobIdsParam = numericJobIds.join(",");

    try {
      // Update store immediately before async call
      setJobIds(jobIdsParam);

      // Call the analysis hook
      const response = await analyzeResume({
        resume,
        jobIds: numericJobIds,
      });

      // Validate the response structure robustly
      // Assuming your hook returns { matches: [...] } based on `MatchResponse`
      const matches = response?.matches; // Use optional chaining

      // Check if the response object itself exists and has the 'matches' property
      if (response && Array.isArray(response.matches)) {
        setResults(response); // Update store with the entire response object

        // Persist results to localStorage (optional, consider if needed)
        // Store the whole response object if persisting
        localStorage.setItem("analysisResults", JSON.stringify(response));

        // Navigate to results page
        router.push("/analysis-results");

        if (matches.length === 0) {
          toast.info(
            "Analysis complete. No significant matches found for the selected jobs."
          );
        } else {
          toast.success(
            `Analysis complete! Found ${matches.length} potential match${
              matches.length > 1 ? "es" : ""
            }.`
          );
        }
      } else {
        // Handle cases where the hook resolves but the structure is wrong
        console.error(
          "[MatchPage - handleAnalyze] Invalid response structure received from analysis hook:",
          response
        );
        toast.error(
          "Analysis completed, but the results format was unexpected. Please check the console."
        );
        localStorage.removeItem("analysisResults");
      }
    } catch (error) {
      // Error handling is likely done within the useResumeAnalysis hook (e.g., showing a toast)
      // Log here for additional context if needed
      console.error(
        "[MatchPage - handleAnalyze] Error occurred during analysis process:",
        error
      );
      // No need to show another toast if the hook already does
      // toast.error("An unexpected error occurred during analysis.");
    }
  };

  // --- Resume Viewer Logic ---
  const renderResumeViewer = (): ReactNode => {
    if (isLoadingResume) return <ResumeLoading />;
    if (resumeError) return <ResumeError onRetry={loadResumeFromDB} />; // Use the retry mechanism
    if (!resume) return <NoResume onUploadClick={handleUploadClick} />;

    // If we reach here, resume exists and is not loading/error
    const fileType = resume.type.toLowerCase();

    // Pass the File object directly to all viewers using the 'file' prop
    if (fileType === "application/pdf") return <PDFViewer file={resume} />;
    if (
      fileType.includes("wordprocessingml.document") || // .docx
      fileType === "application/msword" // .doc (might need specific handling if DocxViewer fails)
    )
      return <DocxViewer file={resume} />;
    if (fileType.startsWith("text/")) return <TextViewer file={resume} />; // Covers text/plain etc.

    // Fallback for unsupported types
    return <UnsupportedFileType fileName={resume.name} />;
  };

  // --- Render ---
  // Show main loader only if jobs are loading *initially* and none are selected yet
  const showInitialJobLoader = isLoadingJobs && selectedJobs.length === 0;

  if (showInitialJobLoader) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <LoaderCircle className="h-16 w-16 text-blue-600 animate-spin" />
          <span className="ml-4 text-neutral-300">Loading job details...</span>
        </div>
      </PublicLayout>
    );
  }

  // Main page content
  return (
    <PublicLayout>
      <div className="text-white p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Match Your Resume
            </h1>
            <p className="text-neutral-400">
              Analyze your resume against the selected jobs to check
              compatibility.
            </p>
          </div>
          {/* Main Content Area (Resume + Jobs) */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Resume Section */}
            <div className="w-full lg:w-1/2">
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
                {/* Resume Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium">Your Resume</h2>
                  {/* Conditional Buttons */}
                  {resume && !showUploadForm && !resumeError && (
                    <ShinyButton
                      onClick={handleUploadClick}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors duration-200 text-sm"
                    >
                      Update Resume
                    </ShinyButton>
                  )}
                  {/* Show upload button if form is hidden, no resume, no error, and not loading */}
                  {!resume &&
                    !showUploadForm &&
                    !resumeError &&
                    !isLoadingResume && (
                      <ShinyButton
                        onClick={handleUploadClick}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm"
                      >
                        Upload Resume
                      </ShinyButton>
                    )}
                </div>

                {/* Resume Content: Upload Form or Viewer */}
                {showUploadForm ? (
                  <div className="mb-4">
                    <FileUpload
                      onChange={handleFileSelection}
                      files={tempFile ? [tempFile] : []}
                      className="bg-black border-neutral-800 hover:border-neutral-700" // Style the upload area
                      maxSizeMB={10} // Example size limit
                      showSaveButton={!!tempFile} // Show save only when a file is staged
                      onSave={handleSaveFile}
                      onCancel={() => {
                        // Allow cancelling the upload form
                        setTempFile(null);
                        setShowUploadForm(false);
                      }}
                      acceptedFileTypes={[
                        // Specify accepted types for better UX
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                        "application/msword", // .doc
                        "text/plain", // .txt
                      ]}
                    />
                  </div>
                ) : (
                  // Container for the resume viewer (PDF, DOCX, TXT, or placeholders)
                  <div className="h-[70vh] min-h-[500px] overflow-hidden rounded-lg border border-neutral-800/50 relative bg-black">
                    {" "}
                    {/* Added bg-black for consistency */}
                    {renderResumeViewer()}
                  </div>
                )}
              </div>
            </div>
            {/* Right Column: Jobs & Analyze Button */}
            <div className="w-full lg:w-1/2 flex flex-col">
              {/* Selected Jobs List */}
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-4 flex-grow">
                <h2 className="text-xl font-medium mb-4">
                  Selected Jobs ({selectedJobs.length})
                </h2>
                {/* Scrollable Job Cards Area */}
                {/* Adjust height calculation based on your layout needs */}
                <div className="h-[calc(70vh-90px)] min-h-[410px] overflow-y-auto pr-2 custom-scrollbar">
                  {" "}
                  {/* Added custom-scrollbar class if you have one */}
                  {isLoadingJobs && selectedJobs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-neutral-400">
                      <LoaderCircle className="h-6 w-6 text-blue-600 animate-spin mr-2" />
                      Loading selected jobs...
                    </div>
                  ) : selectedJobs.length > 0 ? (
                    selectedJobs.map((job) => (
                      <JobCard
                        key={job.id ?? `fallback-${job.job_title}`}
                        job={job}
                      />
                    ))
                  ) : (
                    // Message when no jobs are selected or loaded
                    <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 px-4">
                      <MapPin className="h-10 w-10 text-neutral-600 mb-3" />
                      <p className="font-medium text-neutral-300 mb-1">
                        No Jobs Selected
                      </p>
                      <p className="text-sm">
                        Go to the{" "}
                        <Link
                          href="/jobs"
                          className="text-blue-500 hover:underline"
                        >
                          Jobs page
                        </Link>{" "}
                        to select positions for analysis.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Analyze Button Area */}
              {/* Show Analyze button only if a resume is loaded (not error/loading) and the upload form is hidden */}
              {resume && !resumeError && !showUploadForm && (
                <div className="flex justify-end mt-auto pt-4">
                  <ShinyButton
                    onClick={isAnalyzing ? undefined : handleAnalyze} // Prevent clicks while analyzing
                    className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all duration-200 ${
                      // Disable conditions: analyzing, no resume, no selected jobs
                      isAnalyzing || !resume || selectedJobs.length === 0
                        ? "opacity-60 cursor-not-allowed pointer-events-none"
                        : "hover:shadow-lg hover:shadow-purple-500/30" // Add hover effect when enabled
                    }`}
                    disabled={
                      isAnalyzing || !resume || selectedJobs.length === 0
                    }
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center space-x-2">
                        <LoaderCircle className="h-5 w-5 text-white animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      "Let's Analyze"
                    )}
                  </ShinyButton>
                </div>
              )}

              {/* Prompt to upload resume if needed */}
              {!resume &&
                !resumeError &&
                !isLoadingResume &&
                !showUploadForm &&
                selectedJobs.length > 0 && ( // Only show if jobs are selected but no resume
                  <div className="text-center text-neutral-400 mt-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                    Please{" "}
                    <button
                      onClick={handleUploadClick}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      upload your resume
                    </button>{" "}
                    to start the analysis.
                  </div>
                )}
            </div>{" "}
            {/* End Right Column */}
          </div>{" "}
          {/* End Main Content Flex */}
        </div>{" "}
        {/* End Max Width Container */}
      </div>{" "}
      {/* End Padding Container */}
    </PublicLayout>
  );
}
