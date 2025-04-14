"use client";

interface JobMatch {
  title: string;
  company: string;
  location: string;
  salary: string;
  match: string;
}

export default function MatchJobItem({ job }: { job: JobMatch }) {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-100">
            {job.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {job.company} • {job.location}
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {job.salary}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            parseInt(job.match) > 90
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : parseInt(job.match) > 80
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
          }`}
        >
          {job.match} match
        </span>
      </div>
    </div>
  );
}
