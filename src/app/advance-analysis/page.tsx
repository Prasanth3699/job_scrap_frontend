// app/(pages)/analysis/page.tsx
"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import AnalysisDashboard from "@/components/AnalysisDashboard/AnalysisDashboard";
import { useAdvanceAnalysisStore } from "@/stores/advance-analysis-store";

export default function AnalysisPage() {
  const { result, isAnalyzing } = useAdvanceAnalysisStore();

  return (
    <main className="mx-auto max-w-7xl p-6">
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-brand-accent-from" />
          <p className="mt-4 text-lg text-zinc-200">
            Analyzing your profile...
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            This may take a few moments...
          </p>
        </div>
      ) : result ? (
        <div className="mt-8">
          <AnalysisDashboard result={result} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-zinc-400">No analysis results available.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 text-sm text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      )}
    </main>
  );
}
