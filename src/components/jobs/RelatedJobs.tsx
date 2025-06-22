"use client";

import { Job } from "@/types";
import { useRouter } from "next/navigation";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

interface RelatedJobsProps {
  currentJobId: string;
  jobs: Job[];
}

export default function RelatedJobs({ jobs }: RelatedJobsProps) {
  const router = useRouter();

  if (!jobs.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
        Similar Jobs
        <div className="h-px flex-grow bg-gray-800 ml-4"></div>
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => router.push(`/jobs/${job.id}`)}
            className="bg-black rounded-lg p-5 cursor-pointer hover:bg-slate-950 transition-colors border border-gray-800 hover:border-blue-500/50 shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
              <div>
                <h3 className="text-lg font-medium text-white group-hover:text-blue-400">
                  {job.job_title}
                </h3>
                <p className="text-gray-300 text-sm mt-1">{job.company_name}</p>
              </div>
              <span className="text-green-400 font-medium sm:text-right">
                {job.salary}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-1 text-blue-400/70" />
                {job.location}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Briefcase className="w-4 h-4 mr-1 text-blue-400/70" />
                {job.job_type}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-800 flex justify-end">
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center">
                View details
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
