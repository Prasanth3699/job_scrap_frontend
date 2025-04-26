import { Job } from "@/types";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface JobListProps {
  jobs: Job[] | null | undefined;
  onJobClick: (jobId: string) => void;
  isSelectionMode?: boolean;
  selectedJobs?: string[];
}

export default function JobList({
  jobs,
  onJobClick,
  isSelectionMode = false,
  selectedJobs = [],
}: JobListProps) {
  const jobsArray = Array.isArray(jobs) ? jobs : [];

  if (jobsArray.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobsArray.map((job, index) => (
        <div
          key={`${job.id}-${index}`}
          onClick={() => onJobClick(job.id)}
          className={`relative p-6 cursor-pointer transition-all duration-200 rounded-xl border ${
            selectedJobs.includes(job.id)
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
          }`}
        >
          {/* Selection indicator */}
          {isSelectionMode && (
            <div className="absolute right-6 top-6">
              {selectedJobs.includes(job.id) ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              )}
            </div>
          )}

          <div className="flex flex-col space-y-4 pr-10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {job.job_title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {job.company_name}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {new Date(job.posting_date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                {job.location}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium">
                {job.job_type}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                {job.experience}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-700 dark:text-gray-300 font-medium">
                <span className="text-gray-500 dark:text-gray-400 mr-2">
                  Salary:
                </span>
                {job.salary}
              </div>

              {!isSelectionMode && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  View details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
