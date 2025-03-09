"use client";

import { Job } from "@/types";
import { useRouter } from "next/navigation";

interface RelatedJobsProps {
  currentJobId: string;
  jobs: Job[];
}

export default function RelatedJobs({ currentJobId, jobs }: RelatedJobsProps) {
  const router = useRouter();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-white mb-6">Similar Jobs</h2>
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => router.push(`/jobs/${job.id}`)}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors border border-gray-700 hover:border-blue-500/30"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-white">
                  {job.job_title}
                </h3>
                <p className="text-gray-400 text-sm">{job.company_name}</p>
              </div>
              <span className="text-blue-400 text-sm">{job.salary}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                {job.location}
              </span>
              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                {job.job_type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
