// components/jobs/JobList.tsx
import { Job } from "@/types";

interface JobListProps {
  jobs: Job[] | null | undefined;
  onJobClick: (jobId: string) => void;
}

export default function JobList({ jobs, onJobClick }: JobListProps) {
  // Ensure jobs is an array
  const jobsArray = Array.isArray(jobs) ? jobs : [];

  if (jobsArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobsArray.map((job, index) => (
        <div
          key={`${job.id}-${index}`}
          onClick={() => onJobClick(job.id)}
          className="bg-gray-900 rounded-lg p-6 cursor-pointer hover:bg-gray-800 transition-all duration-200 border border-gray-800 hover:border-blue-500/30"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white hover:text-blue-400 transition-colors">
                  {job.job_title}
                </h2>
                <p className="text-gray-400">{job.company_name}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(job.posting_date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                {job.location}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                {job.job_type}
              </span>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                {job.experience}
              </span>
            </div>

            <div className="text-gray-300">
              <span className="font-medium">Salary:</span> {job.salary}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
