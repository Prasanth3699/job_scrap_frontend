// components/AnalysisDashboard/AtsCard.tsx
import { ATSAnalysis } from "@/lib/llm/client/types";
import ScoreGauge from "./ScoreGauge";
import clsx from "clsx";

interface Props {
  ats: ATSAnalysis;
  className?: string;
}

export default function AtsCard({ ats, className }: Props) {
  return (
    <div
      className={clsx(
        "rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800",
        className
      )}
    >
      <h2 className="mb-4 text-lg font-semibold">ATS Overview</h2>

      <ScoreGauge value={Math.round(ats.score)} />

      <div className="mt-4 space-y-1 text-sm">
        <p>
          <span className="font-medium">Keyword match:</span>{" "}
          {ats.keyword_match_rate.toFixed(1)} %
        </p>
        <p className="font-medium">
          {ats.missing_keywords.length} keywords missing
        </p>
      </div>

      {ats.format_suggestions.length > 0 && (
        <>
          <h3 className="mt-4 text-sm font-semibold">Format suggestions</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {ats.format_suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
