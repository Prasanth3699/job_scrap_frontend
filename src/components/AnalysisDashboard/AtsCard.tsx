import { ATSAnalysis } from "@/lib/llm/client/types";
import ScoreGauge from "./ScoreGauge";
import clsx from "clsx";
import { AlertTriangle, Box, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  ats: ATSAnalysis;
  className?: string;
}

export default function AtsCard({ ats, className }: Props) {
  // Determine status based on score
  const getStatusColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  // Determine appropriate icon for status
  const StatusIcon = () => {
    const score = Math.round(ats.score);
    const colorClass = getStatusColor(score);

    if (score >= 80) {
      return <CheckCircle2 className={`h-5 w-5 ${colorClass}`} />;
    } else if (score >= 60) {
      return <AlertTriangle className={`h-5 w-5 ${colorClass}`} />;
    } else {
      return <XCircle className={`h-5 w-5 ${colorClass}`} />;
    }
  };

  // Format keyword match percentage visualization
  const keywordMatchPercentage = ats.keyword_match_rate.toFixed(1);
  const matchFillWidth = `${Math.min(
    100,
    Math.max(0, ats.keyword_match_rate)
  )}%`;

  return (
    <div
      className={clsx(
        "rounded-xl border overflow-hidden bg-zinc-900 shadow-lg dark:border-zinc-700",
        className
      )}
    >
      {/* Header with enhanced visual hierarchy */}
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-400" />
          ATS Overview
        </h2>
        <div className="flex items-center">
          <StatusIcon />
        </div>
      </div>

      {/* Score gauge */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <ScoreGauge value={Math.round(ats.score)} />
      </div>

      {/* Stats with enhanced visuals */}
      <div className="p-6 bg-zinc-800/30">
        <div className="grid grid-cols-2 gap-8">
          {/* Keyword Match with progress bar */}
          <div>
            <p className="text-sm text-zinc-400 mb-1">Keyword Match</p>
            <p className="text-2xl font-medium text-blue-400 mb-2">
              {keywordMatchPercentage}%
            </p>
            <div className="h-2 w-full bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: matchFillWidth }}
              ></div>
            </div>
          </div>

          {/* Missing Keywords with visual indicator */}
          <div>
            <p className="text-sm text-zinc-400 mb-1">Missing Keywords</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-medium text-blue-400">
                {ats.missing_keywords.length}
              </p>
              <p className="text-sm text-zinc-500 mb-1">
                {ats.missing_keywords.length > 0
                  ? "keywords needed"
                  : "all keywords found"}
              </p>
            </div>

            {ats.missing_keywords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {ats.missing_keywords.slice(0, 3).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-zinc-800 rounded-md text-xs text-zinc-400"
                  >
                    {keyword}
                  </span>
                ))}
                {ats.missing_keywords.length > 3 && (
                  <span className="px-2 py-1 bg-zinc-800 rounded-md text-xs text-zinc-400">
                    +{ats.missing_keywords.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Format suggestions with improved hierarchy and visual indicators */}
      {ats.format_suggestions.length > 0 && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-medium">Format Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {ats.format_suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex gap-3 items-start bg-amber-950/20 rounded-lg p-3"
              >
                <div className="text-amber-400 mt-0.5 flex-shrink-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-400 text-xs font-medium">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm text-zinc-300">{suggestion}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-3 border-t border-zinc-800">
            <button className="w-full py-2 px-4 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-lg text-sm font-medium transition-colors">
              Fix All Suggestions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
