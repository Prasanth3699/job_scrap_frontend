import { useState } from "react";
import { SkillGap } from "@/lib/llm/client/types";
import clsx from "clsx";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  LightbulbIcon,
  X as CloseIcon,
} from "lucide-react";

interface Props {
  gaps: SkillGap[];
  className?: string;
  onShowSuggestions?: (gap: SkillGap) => void;
}

export default function SkillGapsTable({
  gaps,
  className,
  onShowSuggestions,
}: Props) {
  // --- Professional SHOW SUGGESTIONS MODAL state ---
  const [modalGap, setModalGap] = useState<SkillGap | null>(null);

  // Function to show suggestions when clicking on the arrow / button
  function showSuggestions(gap: SkillGap) {
    if (onShowSuggestions) {
      onShowSuggestions(gap);
    } else {
      setModalGap(gap);
    }
  }

  function closeModal() {
    setModalGap(null);
  }
  // --------------------------------------------------

  // Calculate overall skill gap metrics
  const totalGaps = gaps.reduce((acc, gap) => {
    const currentNum = parseSkillLevel(gap.current_level);
    const requiredNum = parseSkillLevel(gap.required_level);

    return acc + Math.max(0, requiredNum - currentNum);
  }, 0);

  console.groupCollapsed("[SkillGapsTable] Skill Gaps Data");
  console.log("Gaps:", JSON.stringify(gaps, null, 2));
  console.groupEnd();

  const highPriorityGaps = gaps.filter((g) => g.priority === "High").length;

  // Sort gaps by priority (High -> Medium -> Low)
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  const sortedGaps = [...gaps].sort((a, b) => {
    return (
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 999) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 999)
    );
  });

  return (
    <div
      className={clsx(
        "rounded-xl border overflow-hidden bg-zinc-900 shadow-lg dark:border-zinc-700",
        className
      )}
    >
      {/* Enhanced header with summary metrics */}
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold">Skill Gap Analysis</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-rose-500"></div>
            <span className="text-xs text-zinc-400">
              {highPriorityGaps} High Priority
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <span className="text-xs text-zinc-400">
              {totalGaps} Levels To Improve
            </span>
          </div>
        </div>
      </div>

      {/* Skills summary cards for small screens */}
      <div className="p-4 md:hidden">
        <div className="space-y-3">
          {sortedGaps.map((gap) => (
            <SkillGapCard
              key={gap.skill}
              gap={gap}
              showSuggestions={showSuggestions}
            />
          ))}
        </div>
      </div>

      {/* Enhanced table for medium+ screens */}
      <div className="hidden md:block p-4">
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800/80 text-left font-medium">
              <tr>
                <th className="px-4 py-3 text-zinc-400">Skill</th>
                <th className="px-4 py-3 text-zinc-400">Priority</th>
                <th className="px-4 py-3 text-zinc-400">Current</th>
                <th className="px-4 py-3 text-zinc-400">Required</th>
                <th className="px-4 py-3 text-zinc-400">Gap</th>
                <th className="w-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {sortedGaps.map((gap) => (
                <tr
                  key={gap.skill}
                  className="group transition-colors hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{gap.skill}</div>
                    {gap.improvement_suggestions &&
                      gap.improvement_suggestions.length > 0 && (
                        <div className="text-xs text-zinc-500 mt-0.5 max-w-xs truncate flex items-center gap-1">
                          <LightbulbIcon className="h-3 w-3 text-amber-500" />
                          <span>
                            {gap.improvement_suggestions.length} suggestions
                            available
                          </span>
                        </div>
                      )}
                  </td>
                  <td className="px-4 py-3">
                    {getPriorityBadge(gap.priority)}
                  </td>
                  <td className="px-4 py-3">
                    <SkillLevel
                      level={gap.current_level}
                      label={getSkillLevelLabel(gap.current_level)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <SkillLevel
                      level={gap.required_level}
                      label={getSkillLevelLabel(gap.required_level)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <SkillGapIndicator
                      current={gap.current_level}
                      required={gap.required_level}
                    />
                  </td>
                  <td className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1 text-zinc-500 hover:text-zinc-300 rounded-full hover:bg-zinc-800"
                      onClick={() => showSuggestions(gap)}
                      aria-label={`Show improvement suggestions for ${gap.skill}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons section */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between">
          <div className="text-xs text-zinc-500">
            {sortedGaps.reduce((count, gap) => {
              return count + (gap.improvement_suggestions?.length || 0);
            }, 0)}{" "}
            total improvement suggestions available
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-1 py-1 px-3 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors">
              <GraduationCap className="h-3.5 w-3.5" />
              Learning Resources
            </button>
            <button className="flex items-center gap-1 py-1 px-3 text-xs font-medium bg-indigo-600/30 hover:bg-indigo-600/50 rounded-md text-indigo-400 transition-colors">
              <BookOpen className="h-3.5 w-3.5" />
              Create Learning Plan
            </button>
          </div>
        </div>
      </div>

      {/* SUGGESTIONS MODAL */}
      {modalGap && <SuggestionsModal gap={modalGap} onClose={closeModal} />}
    </div>
  );
}

// Helper function to parse skill level, handling 'N/A' values
function parseSkillLevel(level: string | number): number {
  if (level === "N/A" || level === null) {
    return 0;
  }
  return typeof level === "string"
    ? level === "Basic"
      ? 2
      : level === "Intermediate"
      ? 3
      : level === "Advanced"
      ? 4
      : level === "Expert"
      ? 5
      : parseInt(level, 10) || 0
    : level;
}

// For mobile/responsive view
function SkillGapCard({
  gap,
  showSuggestions,
}: {
  gap: SkillGap;
  showSuggestions: (gap: SkillGap) => void;
}) {
  const currentNum = parseSkillLevel(gap.current_level);
  const requiredNum = parseSkillLevel(gap.required_level);

  const gapSize = Math.max(0, requiredNum - currentNum);
  const hasSuggestions =
    gap.improvement_suggestions && gap.improvement_suggestions.length > 0;

  return (
    <div className="rounded-lg border border-zinc-800 p-3 bg-zinc-800/20">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{gap.skill}</div>
        {getPriorityBadge(gap.priority)}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <div className="text-xs text-zinc-500 mb-1">Current</div>
          <SkillLevel
            level={gap.current_level}
            label={getSkillLevelLabel(gap.current_level)}
            compact
          />
        </div>
        <div>
          <div className="text-xs text-zinc-500 mb-1">Required</div>
          <SkillLevel
            level={gap.required_level}
            label={getSkillLevelLabel(gap.required_level)}
            compact
          />
        </div>
      </div>

      {gapSize > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-800">
          <SkillGapIndicator
            current={gap.current_level}
            required={gap.required_level}
            showProgress
          />
        </div>
      )}

      {hasSuggestions && (
        <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between items-center">
          <div className="text-xs text-zinc-400 flex items-center gap-1">
            <LightbulbIcon className="h-3 w-3 text-amber-500" />
            <span>{gap.improvement_suggestions.length} improvement tips</span>
          </div>
          <button
            className="text-xs text-indigo-400 hover:text-indigo-300 py-1 px-2 hover:bg-indigo-900/30 rounded transition-colors"
            onClick={() => showSuggestions(gap)}
          >
            View Tips
          </button>
        </div>
      )}
    </div>
  );
}

function getPriorityBadge(priority: string) {
  const colorMap: Record<string, string> = {
    High: "bg-rose-900/50 text-rose-400 border-rose-700/50",
    Medium: "bg-amber-900/50 text-amber-400 border-amber-700/50",
    Low: "bg-emerald-900/50 text-emerald-400 border-emerald-700/50",
  };

  const color =
    colorMap[priority] || "bg-blue-900/50 text-blue-400 border-blue-700/50";

  return (
    <span
      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${color} border`}
    >
      {priority}
    </span>
  );
}

function getSkillLevelLabel(level: string | number): string {
  if (level === "N/A" || level === null) {
    return "N/A";
  }

  if (
    typeof level === "string" &&
    ["Basic", "Intermediate", "Advanced", "Expert"].includes(level)
  ) {
    return level;
  }

  const numLevel = typeof level === "string" ? parseInt(level, 10) : level;

  if (isNaN(numLevel)) {
    return "N/A";
  }

  const labels = [
    "None",
    "Beginner",
    "Basic",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  return labels[numLevel] || `Level ${numLevel}`;
}

function SkillLevel({
  level,
  label,
  compact = false,
}: {
  level: string | number;
  label: string;
  compact?: boolean;
}) {
  // Convert to number if string
  const numLevel = parseSkillLevel(level);
  const isNA = level === "N/A" || level === null;

  return (
    <div
      className={`flex ${compact ? "flex-col gap-1" : "items-center gap-2"}`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${
              i < numLevel
                ? numLevel >= 4
                  ? "bg-indigo-500"
                  : numLevel >= 3
                  ? "bg-blue-500"
                  : "bg-zinc-500"
                : "bg-zinc-700"
            } ${compact ? "h-1.5 w-1.5" : ""}`}
          />
        ))}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={`${compact ? "text-xs" : "text-xs"} ${
            isNA ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function SkillGapIndicator({
  current,
  required,
  showProgress = false,
}: {
  current: string | number;
  required: string | number;
  showProgress?: boolean;
}) {
  // Convert to numbers if strings
  const currentNum = parseSkillLevel(current);
  const requiredNum = parseSkillLevel(required);
  const isNA =
    current === "N/A" ||
    required === "N/A" ||
    current === null ||
    required === null;

  const gap = Math.max(0, requiredNum - currentNum);

  // Handle N/A values
  if (isNA) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
        <span className="text-xs text-amber-500">
          +{requiredNum || "NaN"} levels needed
        </span>
      </div>
    );
  }

  // Return different component if already at or above required level
  if (gap <= 0) {
    return (
      <span className="inline-flex items-center text-xs text-emerald-400 gap-1.5">
        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
        At required level
      </span>
    );
  }

  if (showProgress) {
    // Calculate width for progress visualization
    const progressWidth =
      requiredNum > 0 ? (currentNum / requiredNum) * 100 : 0;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-amber-500">+{gap} levels needed</span>
          <span className="text-zinc-500">
            {currentNum}/{requiredNum}
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full"
            style={{ width: `${Math.max(5, progressWidth)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
      <span className="text-xs text-amber-500">+{gap} levels needed</span>
    </div>
  );
}

// ---- Professional Suggestions Modal ----

function SuggestionsModal({
  gap,
  onClose,
}: {
  gap: SkillGap;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <LightbulbIcon className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold">
            {gap.skill} - Improvement Suggestions
          </h3>
        </div>
        {gap.improvement_suggestions &&
        gap.improvement_suggestions.length > 0 ? (
          <ul className="space-y-3 mt-3">
            {gap.improvement_suggestions.map((tip, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="mt-0.5 flex-shrink-0 text-amber-500">
                  <LightbulbIcon className="h-4 w-4" />
                </span>
                <span className="text-zinc-100">{tip}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-zinc-400 mt-4">
            No improvement suggestions for this skill at this time.
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-indigo-700 text-white font-medium rounded hover:bg-indigo-600 shadow-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
