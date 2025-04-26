"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { get, set } from "idb-keyval";
import PublicLayout from "@/components/layout/PublicLayout";
import { jobsApi } from "@/lib/api/jobs-api";
import { FileUpload } from "@/components/ui/file-upload";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Job } from "@/types";
import { useResumeAnalysis } from "@/hooks/ml/use-resume-analysis";
import { useAnalysisStore } from "@/stores/analysis-store";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Lucide Icons
import {
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  LoaderCircle,
} from "lucide-react";

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

const ResumeLoading = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6">
    <LoaderCircle className="h-12 w-12 text-blue-600 animate-spin mb-4" />
    <p className="text-neutral-400">Loading resume preview...</p>
  </div>
);

const UnsupportedFileType = ({ fileName }: { fileName: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6">
    <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
    <p className="text-white font-medium mb-2">Unsupported File Type</p>
    <p className="text-neutral-400 text-center">
      The file &quot;{fileName}&quot; cannot be previewed. Supported formats
      include PDF, DOCX, and TXT.
    </p>
  </div>
);

const JobCard = ({ job }: { job: Job }) => {
  const jobKey = job?.id || job?.job_title;
  if (!jobKey) return null;

  return (
    <div
      key={jobKey}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4 hover:border-neutral-700 transition-colors duration-200"
    >
      <h3 className="text-lg text-white font-medium mb-2">
        {job.job_title || "Untitled Position"}
      </h3>
      <div className="flex items-center mb-2">
        <div className="mr-2 h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center">
          <span className="text-xs text-white">
            {job.company_name?.charAt(0) || "?"}
          </span>
        </div>
        <span className="text-neutral-300">
          {job.company_name || "Unknown Company"}
        </span>
      </div>
      <div className="text-sm text-neutral-400">
        {job.location && (
          <div className="flex items-center mb-1">
            <MapPin className="h-4 w-4 mr-2" />
            {job.location}
          </div>
        )}
        {job.job_type && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {job.job_type}
          </div>
        )}
      </div>
    </div>
  );
};

const NoResume = ({ onUploadClick }: { onUploadClick: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg border border-neutral-800 p-6">
    <FileText className="h-12 w-12 text-blue-500 mb-4" />
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

export default function MatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resume, setResume] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const { analyzeResume, isAnalyzing } = useResumeAnalysis();
  const { setResults, setJobIds } = useAnalysisStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const jobIds = searchParams.get("jobs")?.split(",") || [];

        if (jobIds.length === 0) {
          router.push("/jobs");
          return;
        }

        const jobPromises = jobIds.map((id) =>
          jobsApi.getJobById(id).catch((err) => {
            console.error(`Failed to fetch job ${id}:`, err);
            return null;
          })
        );
        const jobsResponses = await Promise.all(jobPromises);
        const nonNullResponses = jobsResponses.filter((res) => res !== null);

        const jobsData = nonNullResponses
          .map((response) => {
            const job = response;
            if (job?.job_title) return job;
            return null;
          })
          .filter(Boolean);

        setSelectedJobs(jobsData);

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

  const handleFileSelection = (files: File[]) => {
    if (files.length > 0) {
      setTempFile(files[0]);
    }
  };

  const handleSaveFile = async () => {
    if (!tempFile) return;

    try {
      await set("resume", tempFile);
      setResume(tempFile);
      setTempFile(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const goToResumeUpload = () => {
    const jobIds = searchParams.get("jobs");
    router.push(`/upload-resume?jobs=${jobIds}`);
  };

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
        localStorage.setItem("analysisResults", JSON.stringify(result));
        router.push("/analysis-results");
      } else {
        throw new Error("Received empty or invalid results");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    }
  };

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

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <LoaderCircle className="h-16 w-16 text-blue-600 animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Match Your Resume
            </h1>
            <p className="text-neutral-400">
              We&apos;ll analyze your resume against the selected jobs to find
              the best matches
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
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

                {showUploadForm ? (
                  <div className="mb-4">
                    <FileUpload
                      onChange={handleFileSelection}
                      files={tempFile ? [tempFile] : []}
                      className="bg-black border-neutral-800"
                      maxSizeMB={5}
                      showSaveButton={tempFile !== null}
                      onSave={handleSaveFile}
                    />
                  </div>
                ) : (
                  <div className="h-[70vh] overflow-hidden rounded-lg">
                    {renderResumeViewer()}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-4">
                <h2 className="text-xl font-medium mb-4">
                  Selected Jobs ({selectedJobs.length})
                </h2>
                <div className="h-[60vh] overflow-y-auto pr-2">
                  {selectedJobs.length > 0 ? (
                    selectedJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-400">
                      {isLoading
                        ? "Loading jobs..."
                        : "No jobs selected or failed to load"}
                    </div>
                  )}
                </div>
              </div>

              {resume && (
                <div className="flex justify-end mt-4">
                  <ShinyButton
                    onClick={isAnalyzing ? undefined : handleAnalyze}
                    className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all duration-200 ${
                      isAnalyzing
                        ? "opacity-70 cursor-not-allowed pointer-events-none"
                        : ""
                    }`}
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
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
