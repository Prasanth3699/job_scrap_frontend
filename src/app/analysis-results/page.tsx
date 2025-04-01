"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Job } from "@/types";
import { Sparkles } from "lucide-react";
import { useAnalysisStore } from "@/stores/analysis-store";
import { AnalysisResultSchema } from "@/stores/analysis-schema";

interface AnalysisResult {
  job_id: string;
  overall_score: number;
  score_breakdown: {
    skills: number;
    experience: number;
    salary: number;
    title: number;
    location: number;
    job_type: number;
    company: number;
  };
  missing_skills: string[];
  matching_skills: string[];
  explanation: string;
  job_details: Job;
}

const ScoreMeter = ({ value }: { value: number }) => {
  const percentage = Math.round(value * 100);

  const getColorClass = (val: number) => {
    if (val >= 0.8) return "bg-green-500";
    if (val >= 0.6) return "bg-blue-500";
    if (val >= 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full bg-neutral-800 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${getColorClass(value)}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const ScoreBadge = ({ value }: { value: number }) => {
  const percentage = Math.round(value * 100);

  const getColorClass = (val: number) => {
    if (val >= 0.8) return "bg-green-900/30 text-green-400 border-green-800";
    if (val >= 0.6) return "bg-blue-900/30 text-blue-400 border-blue-800";
    if (val >= 0.4) return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
    return "bg-red-900/30 text-red-400 border-red-800";
  };

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorClass(
        value
      )}`}
    >
      {percentage}%
    </div>
  );
};

const CategoryScore = ({ name, value }: { name: string; value: number }) => {
  const percentage = Math.round(value * 100);

  const getColorClass = (val: number) => {
    if (val >= 0.8) return "text-green-400";
    if (val >= 0.6) return "text-blue-400";
    if (val >= 0.4) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-neutral-300 text-sm capitalize">{name}</span>
      <div className="flex items-center space-x-2 w-40">
        <ScoreMeter value={value} />
        <span
          className={`text-xs font-medium tabular-nums ${getColorClass(value)}`}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const JobMatchCard = ({ result }: { result: AnalysisResult }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 lg:p-6 mb-6 hover:border-neutral-700 transition-colors duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-white mr-2">
              {result.job_details.job_title}
            </h3>
            <ScoreBadge value={result.overall_score} />
          </div>

          <div className="flex items-center space-x-4 text-neutral-400 text-sm">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
              {result.job_details.company_name}
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
              {result.job_details.location}
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
              {result.job_details.job_type}
            </div>
          </div>
        </div>

        <a
          href={result.job_details.apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity duration-200 text-sm font-medium inline-flex items-center"
        >
          Apply Now
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </a>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-white">Match Breakdown</h4>
          <div className="flex items-center">
            <span className="text-neutral-400 text-sm mr-2">Overall:</span>
            <ScoreBadge value={result.overall_score} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(result.score_breakdown).map(([category, value]) => (
            <CategoryScore key={category} name={category} value={value} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-neutral-300 text-sm">{result.explanation}</p>
          </div>
        </div>
      </div>

      {result.matching_skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-medium text-white mb-3">
            Strong Matching Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.matching_skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.missing_skills.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-white mb-3">
            Missing Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const matchQualityLabels = [
  {
    min: 0,
    max: 39,
    label: "Weak match",
    description: "Consider focusing on other opportunities",
    color: "text-red-500",
  },
  {
    min: 40,
    max: 59,
    label: "Moderate match",
    description: "Some alignment, but significant gaps",
    color: "text-yellow-500",
  },
  {
    min: 60,
    max: 79,
    label: "Good match",
    description: "Strong alignment with room for improvement",
    color: "text-blue-500",
  },
  {
    min: 80,
    max: 100,
    label: "Excellent match",
    description: "Near perfect alignment with this role",
    color: "text-green-500",
  },
];

const getMatchQuality = (score: number) => {
  const percentage = Math.round(score * 100);
  return (
    matchQualityLabels.find(
      (q) => percentage >= q.min && percentage <= q.max
    ) || matchQualityLabels[0]
  );
};

export default function AnalysisResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { results, jobIds } = useAnalysisStore();

  // Validate results with Zod
  const validatedResults = results
    .map((result) => {
      try {
        return AnalysisResultSchema.parse(result);
      } catch (error) {
        console.error("Validation error for result:", result, error);
        return null;
      }
    })
    .filter(Boolean);

  useEffect(() => {
    console.log("Validated results:", validatedResults);

    if (validatedResults.length === 0) {
      toast.error("No valid analysis results found");
      router.push(`/match${jobIds ? `?jobs=${jobIds}` : ""}`);
      return;
    }

    setIsLoading(false);
  }, [validatedResults, router, jobIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4" />
          <p className="text-neutral-400">Loading your resume matches...</p>
        </div>
      </div>
    );
  }

  // Calculate average match score
  const averageScore =
    validatedResults.length > 0
      ? validatedResults.reduce(
          (sum, result) => sum + result.overall_score,
          0
        ) / validatedResults.length
      : 0;

  const averageMatchQuality = getMatchQuality(averageScore);

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-500 mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analysis Results
            </h1>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-neutral-400">Jobs analyzed</p>
                <h2 className="text-2xl font-bold text-white">
                  {results.length} positions
                </h2>
              </div>

              <div>
                <p className="text-neutral-400">Average match</p>
                <div className="flex items-center">
                  <ScoreBadge value={averageScore} />
                  <span
                    className={`ml-2 font-medium ${averageMatchQuality.color}`}
                  >
                    {averageMatchQuality.label}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => router.push("/match")}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Back to matching
                </button>
              </div>
            </div>
          </div>

          <p className="text-neutral-400">
            Your resume has been analyzed against {results.length} job
            positions. Below you&apos;ll see how well you match with each
            opportunity.
          </p>
        </div>

        {/* Sorting/filtering controls - can be added later */}

        {/* Results list */}
        <div className="space-y-6">
          {/* Sorting selector */}

          {/* Job matches */}
          {results
            .sort((a, b) => b.overall_score - a.overall_score)
            .map((result) => (
              <JobMatchCard key={result.job_id} result={result} />
            ))}
        </div>
      </div>
    </div>
  );
}
