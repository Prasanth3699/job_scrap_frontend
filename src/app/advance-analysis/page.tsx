"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import AnalysisDashboard from "@/components/AnalysisDashboard/AnalysisDashboard";
import { useAdvanceAnalysisStore } from "@/stores/advance-analysis-store";
import PublicLayout from "@/components/layout/PublicLayout";

export default function AnalysisPage() {
  const { result, isAnalyzing } = useAdvanceAnalysisStore();

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl p-6">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-70 blur"></div>
              <Loader2 className="relative h-16 w-16 animate-spin text-white" />
            </div>
            <p className="mt-6 text-xl font-medium text-zinc-200">
              Analyzing your profile
            </p>
            <p className="mt-2 text-zinc-400">
              We&apos;re processing your information for the best possible
              insights
            </p>
            <div className="mt-8 w-64 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse"></div>
            </div>
          </div>
        ) : result ? (
          <div className="mt-4">
            <AnalysisDashboard result={result} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="p-4 rounded-full bg-zinc-800 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-zinc-300">
              No analysis results available
            </h3>
            <p className="text-zinc-500 mt-2 mb-6">
              Submit your profile to see professional insights
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 text-sm font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 shadow-sm transition-all hover:shadow-md hover:translate-y-[-1px]"
            >
              Go Back
            </button>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
