"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { get, set } from "idb-keyval"; // Add set import
import { jobsApi } from "@/lib/api/jobs-api";
import { FileUpload } from "@/components/ui/file-upload";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Job } from "@/types";

import { useResumeAnalysis } from "@/hooks/ml/use-resume-analysis";
import { useAnalysisStore } from "@/stores/analysis-store";
import { toast } from "sonner";

// PDF viewer libraries will need to be imported at component level for client-side usage
import dynamic from "next/dynamic";

// Dynamically import PDF viewer to avoid SSR issues
const PDFViewer = dynamic(() => import("@/components/resume/PDFViewer"), {
  ssr: false,
  loading: () => <ResumeLoading />,
});

const DocxViewer = dynamic(() => import("@/components/resume/DocxViewer"), {
  ssr: false,
  loading: () => <ResumeLoading />,
});

const TextViewer = dynamic(() => import("@/components/resume/TextViewer"), {
  ssr: false,
  loading: () => <ResumeLoading />,
});

// Loading state for resume viewer
const ResumeLoading = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
    <p className="text-neutral-400">Loading resume preview...</p>
  </div>
);

// Error component for unsupported file types
const UnsupportedFileType = ({ fileName }: { fileName: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6">
    <svg
      className="h-12 w-12 text-red-500 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      ></path>
    </svg>
    <p className="text-white font-medium mb-2">Unsupported File Type</p>
    <p className="text-neutral-400 text-center">
      The file &quot;{fileName}&quot; cannot be previewed. Supported formats
      include PDF, DOCX, and TXT.
    </p>
  </div>
);

// Job card component to display selected jobs
const JobCard = ({ job }: { job: Job }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4 hover:border-neutral-700 transition-colors duration-200">
    <h3 className="text-lg text-white font-medium mb-2">{job.job_title}</h3>
    <div className="flex items-center mb-2">
      <div className="mr-2 h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center">
        <span className="text-xs text-white">{job.company_name.charAt(0)}</span>
      </div>
      <span className="text-neutral-300">{job.company_name}</span>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {/* Remove tags rendering if not present in the interface */}
      {/* You might want to add tags to the interface if needed */}
    </div>
    <div className="text-sm text-neutral-400">
      <div className="flex items-center mb-1">
        <svg
          className="h-4 w-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        {job.location}
      </div>
      <div className="flex items-center">
        <svg
          className="h-4 w-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        {job.job_type}
      </div>
    </div>
  </div>
);

// No resume component to prompt user to upload resume
const NoResume = ({ onUploadClick }: { onUploadClick: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6">
    <svg
      className="h-12 w-12 text-blue-500 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      ></path>
    </svg>
    <p className="text-white font-medium mb-2">No Resume Found</p>
    <p className="text-neutral-400 text-center mb-6">
      Upload your resume to see how it matches with your selected jobs
    </p>
    <ShinyButton
      onClick={onUploadClick}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity duration-200"
    >
      Upload Resume
    </ShinyButton>
  </div>
);

// Main match page component
export default function MatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resume, setResume] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  // const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { analyzeResume, isAnalyzing } = useResumeAnalysis();
  const { setResults, setJobIds } = useAnalysisStore();

  // Load selected jobs and resume on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // 1. Get job IDs from URL
        const jobIds = searchParams.get("jobs")?.split(",") || [];

        if (jobIds.length === 0) {
          // Redirect back to jobs page if no jobs are selected
          router.push("/jobs");
          return;
        }

        // 2. Fetch job details for selected IDs
        const jobPromises = jobIds.map((id) => jobsApi.getJobById(id));
        const jobsData = await Promise.all(jobPromises);
        setSelectedJobs(jobsData);

        // 3. Load resume from IndexedDB
        const storedResume = await get("resume");
        setResume(storedResume || null);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams, router]);

  // Handle file selection
  const handleFileSelection = (files: File[]) => {
    if (files.length > 0) {
      setTempFile(files[0]);
    }
  };

  // Save the resume file
  const handleSaveFile = async () => {
    if (!tempFile) return;

    try {
      // Update IndexedDB
      await set("resume", tempFile);
      setResume(tempFile);
      setTempFile(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const goToResumeUpload = () => {
    // Pass the current job selection back to the upload page
    const jobIds = searchParams.get("jobs");
    router.push(`/upload-resume?jobs=${jobIds}`);
  };

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!resume || selectedJobs.length === 0) {
      toast.error("Please upload a resume and select jobs");
      return;
    }

    try {
      const jobIdsParam = searchParams.get("jobs") || "";
      setJobIds(jobIdsParam);

      const result = await analyzeResume({
        resume,
        jobIds: selectedJobs.map((job) => Number(job.id)),
      });

      if (result && Array.isArray(result) && result.length > 0) {
        setResults(result);
        localStorage.setItem("analysisResults", JSON.stringify(result)); // Additional backup
        router.push("/analysis-results");
      } else {
        throw new Error("Received empty or invalid results");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    }
  };

  // const handleAnalyze = async () => {
  //   // Ensure resume and jobs are selected
  //   if (!resume || selectedJobs.length === 0) {
  //     toast.error("Please upload a resume and select jobs");
  //     return;
  //   }

  //   try {
  //     const jobIdsParam = searchParams.get("jobs") || "";
  //     setJobIds(jobIdsParam);

  //     toast.promise(
  //       analyzeResume({
  //         resume,
  //         jobIds: selectedJobs.map((job) => Number(job.id)),
  //       }),
  //       {
  //         loading: "Analyzing your resume...",
  //         success: (result) => {
  //           if (!result || !Array.isArray(result)) {
  //             throw new Error("Invalid results format");
  //           }
  //           setResults(result);
  //           router.push("/analysis-results");
  //           return "Analysis completed!";
  //         },
  //         error: (error) => {
  //           console.error("Analysis error:", error);
  //           return error.message || "Failed to analyze resume";
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //     toast.error("An unexpected error occurred");
  //   }
  // };

  const renderResumeViewer = () => {
    if (!resume) return <NoResume onUploadClick={goToResumeUpload} />;

    const fileType = resume.type.toLowerCase();

    if (fileType === "application/pdf") {
      return <PDFViewer file={resume} />;
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      return <DocxViewer file={resume} />;
    } else if (fileType === "text/plain") {
      return <TextViewer file={resume} />;
    } else {
      return <UnsupportedFileType fileName={resume.name} />;
    }
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Match Your Resume
          </h1>
          <p className="text-neutral-400">
            We&apos;ll analyze your resume against the selected jobs to find the
            best matches
          </p>
        </div>

        {/* Main content area with split view */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Resume preview section */}
          <div className="w-full lg:w-1/2">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Your Resume</h2>
                {resume && (
                  <ShinyButton
                    onClick={() => setShowUploadForm(true)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors duration-200"
                  >
                    Update Resume
                  </ShinyButton>
                )}
              </div>

              {/* Show file upload form if requested */}
              {showUploadForm ? (
                <div className="mb-4">
                  <FileUpload
                    onChange={handleFileSelection}
                    files={tempFile ? [tempFile] : []}
                    className="bg-black border-neutral-800"
                    maxSizeMB={5}
                    showSaveButton={tempFile !== null}
                    onSave={handleSaveFile}
                    onCancel={() => {
                      setShowUploadForm(false);
                      setTempFile(null);
                    }}
                  />
                </div>
              ) : (
                <div className="h-[70vh] overflow-hidden rounded-lg">
                  {renderResumeViewer()}
                </div>
              )}
            </div>
          </div>

          {/* Selected jobs section */}
          <div className="w-full lg:w-1/2">
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-4">
              <h2 className="text-xl font-medium mb-4">
                Selected Jobs ({selectedJobs.length})
              </h2>
              <div className="h-[60vh] overflow-y-auto pr-2">
                {selectedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>

            {/* Analysis button */}
            {resume && (
              <div className="flex justify-end mt-4">
                <ShinyButton
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all duration-200 ${
                    isAnalyzing
                      ? "opacity-70 cursor-not-allowed pointer-events-none"
                      : ""
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Let's Analyze"
                  )}
                </ShinyButton>
                {/*  <ShinyButton
                  onClick={isAnalyzing ? undefined : handleAnalyze}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all duration-200 ${
                    isAnalyzing
                      ? "opacity-70 cursor-not-allowed pointer-events-none"
                      : ""
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Let's Analyze"
                  )}
                </ShinyButton> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
