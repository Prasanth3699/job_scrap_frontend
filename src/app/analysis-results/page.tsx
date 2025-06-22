"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// --- Library Imports ---
import { toast } from "sonner";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Clock,
  Building,
  BarChart,
  Info,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Code,
  FileText,
  Target,
  TrendingUp,
  Loader2,
} from "lucide-react";

// --- Local Imports ---
import { useAnalysisStore } from "@/stores/analysis-store";
// Use the correct schema and types from the updated schema file
import { MatchResponseSchema, JobMatchResult } from "@/stores/analysis-schema";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLLMComprehensiveAnalysis } from "@/hooks/llm/use-advanced-analysis";
import { ResumeJobRequest } from "@/lib/llm/client/types";
import { useAdvanceAnalysisStore } from "@/stores/advance-analysis-store";

// --- Constants & Helpers ---
const ACCENT_GRADIENT = "from-brand-accent-from to-brand-accent-to";
const ACCENT_TEXT_GRADIENT = `bg-gradient-to-r ${ACCENT_GRADIENT} bg-clip-text text-transparent`;

const STATUS_COLORS = {
  SUCCESS: {
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-950/60",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    baseGradientFrom: "from-emerald-500",
    baseGradientTo: "to-emerald-600",
    darkerBg: "bg-emerald-600/10",
    shadow: "shadow-emerald-500/30",
    hoverShadow: "hover:shadow-emerald-500/40",
    focusRing: "focus:ring-emerald-500",
  },
  INFO: {
    text: "text-sky-400",
    border: "border-sky-500/40",
    bg: "bg-sky-950/60",
    icon: CheckCircle,
    iconColor: "text-sky-400",
    baseGradientFrom: "from-sky-500",
    baseGradientTo: "to-sky-600",
    darkerBg: "bg-sky-600/10",
    shadow: "shadow-sky-500/30",
    hoverShadow: "hover:shadow-sky-500/40",
    focusRing: "focus:ring-sky-500",
  },
  WARNING: {
    text: "text-amber-400",
    border: "border-amber-500/40",
    bg: "bg-amber-950/60",
    icon: Info,
    iconColor: "text-amber-400",
    baseGradientFrom: "from-amber-500",
    baseGradientTo: "to-amber-600",
    darkerBg: "bg-amber-600/10",
    shadow: "shadow-amber-500/30",
    hoverShadow: "hover:shadow-amber-500/40",
    focusRing: "focus:ring-amber-500",
  },
  DANGER: {
    text: "text-red-400",
    border: "border-red-500/40",
    bg: "bg-red-950/60",
    icon: XCircle,
    iconColor: "text-red-400",
    baseGradientFrom: "from-red-500",
    baseGradientTo: "to-red-600",
    darkerBg: "bg-red-600/10",
    shadow: "shadow-red-500/30",
    hoverShadow: "hover:shadow-red-500/40",
    focusRing: "focus:ring-red-500",
  },
};

// Helper function to get status color object based on a numeric value (0-1)
const getStatusInfo = (value: number) => {
  if (value >= 0.8) return STATUS_COLORS.SUCCESS;
  if (value >= 0.6) return STATUS_COLORS.INFO;
  if (value >= 0.4) return STATUS_COLORS.WARNING;
  return STATUS_COLORS.DANGER;
};

// --- Radial Progress Bar Component (Keep as is) ---
const RadialProgressBar = ({
  value,
  size = 80,
  strokeWidth = 7,
  baseColor = "stroke-zinc-700/60",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  baseColor?: string;
}) => {
  const shouldReduceMotion = useReducedMotion();
  const percentage = Math.max(0, Math.min(100, Math.round(value * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = `radialGradient-${React.useId()}`;
  const statusInfo = getStatusInfo(value);

  // Tailwind color names to Hex mapping (ensure these match your config)
  const colorMap: Record<string, string> = {
    "emerald-500": "#10b981",
    "emerald-600": "#059669",
    "emerald-400": "#34d399",
    "sky-500": "#0ea5e9",
    "sky-600": "#0284c7",
    "sky-400": "#38bdf8",
    "amber-500": "#f59e0b",
    "amber-600": "#d97706",
    "amber-400": "#fbbf24",
    "red-500": "#ef4444",
    "red-600": "#dc2626",
    "red-400": "#f87171",
  };
  const getColorName = (tailwindClass: string): string => {
    const match = tailwindClass.match(
      /(?:from|to|text|border|bg|shadow)-([a-z]+-\d{2,3})/
    );
    return match ? match[1] : "zinc-500";
  };
  const progressColorStopFrom =
    colorMap[getColorName(statusInfo.baseGradientFrom)] || "#71717a";
  const progressColorStopTo =
    colorMap[getColorName(statusInfo.baseGradientTo)] || "#a1a1aa";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={progressColorStopFrom} />
            <stop offset="100%" stopColor={progressColorStopTo} />
          </linearGradient>
        </defs>
        <circle
          className={baseColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
          }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-semibold ${statusInfo.text}`}>
          {percentage}
          <span className="text-xs opacity-80">%</span>
        </span>
      </div>
    </div>
  );
};

// --- Category Score Item Component (Keep as is) ---
const CategoryScoreItem = ({
  name,
  value,
}: {
  name: string;
  value: number;
}) => {
  const percentage = Math.round(value * 100);
  const statusInfo = getStatusInfo(value);
  return (
    <div className="flex justify-between items-center space-x-4 py-2.5 border-b border-zinc-800/60 last:border-b-0">
      <span className="text-sm capitalize text-zinc-300 font-normal">
        {name.replace(/_/g, " ")}
      </span>
      <span className={`text-sm font-medium ${statusInfo.text}`}>
        {percentage}%
      </span>
    </div>
  );
};

// --- Skill Tag Component (Keep as is) ---
const SkillTag = ({
  skill,
  type,
}: {
  skill: string;
  type: "matching" | "missing";
}) => {
  const statusInfo =
    type === "matching" ? STATUS_COLORS.SUCCESS : STATUS_COLORS.DANGER;
  const IconComponent = statusInfo.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-default border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} shadow-sm`}
    >
      <IconComponent size={14} className={statusInfo.iconColor} />
      <span>{skill}</span>
    </motion.div>
  );
};

// --- Job Match Card Component (UPDATED with parsedResumeId and new log handler) ---
const JobMatchCard = ({
  result,
  parsedResumeId,
  index,
  onAdvancedAnalysisClick,
  isAnalyzing,
}: {
  result: JobMatchResult;
  parsedResumeId: number | null | undefined;
  index: number;
  onAdvancedAnalysisClick: (payload: ResumeJobRequest) => void;
  isAnalyzing: boolean;
}) => {
  const router = useRouter();
  const setIsAnalyzing = useAdvanceAnalysisStore(
    (state) => state.setIsAnalyzing
  );

  // Updated click handler to log both IDs
  const handleAdvancedAnalysisClick = async () => {
    const originalId = result.original_job_id ?? "N/A";
    const resumeId = parsedResumeId ?? "N/A";

    try {
      const payload: ResumeJobRequest = {
        original_job_id: originalId,
        parsed_resume_id: resumeId,
      };

      // Set analyzing state to true
      setIsAnalyzing(true);

      // Redirect to analysis page first
      router.push("/advance-analysis");
      // Trigger the analysis
      const analysisResult = await onAdvancedAnalysisClick(payload);

      if (analysisResult) {
        // Update store with results
        useAdvanceAnalysisStore.getState().setResult(analysisResult);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Failed to perform advanced analysis");
      setIsAnalyzing(false);
    }
  };

  // onAdvancedAnalysisClick(payload);

  //   toast.info(
  //     `Original Job ID: ${originalId}\nParsed Resume ID: ${resumeId}`,
  //     {
  //       description: `Details for: ${result.job_details.job_title}`,
  //       duration: 5000,
  //     }
  //   );
  // };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const score = result.overall_score;
  const statusInfo = getStatusInfo(score);
  const applyButtonGradient = `${statusInfo.baseGradientFrom} ${statusInfo.baseGradientTo}`;
  const applyButtonShadow = statusInfo.shadow;
  const applyButtonHoverShadow = statusInfo.hoverShadow;
  const applyButtonFocusRing = statusInfo.focusRing;

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
      className={`relative bg-gradient-to-br from-zinc-900/80 via-zinc-950/80 to-zinc-950/95 backdrop-blur-sm border border-zinc-700/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group hover:border-zinc-600/80 hover:shadow-glow-lg hover:-translate-y-1.5`}
    >
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* === Left Column: Score, Meta Info, Actions === */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex justify-center lg:justify-start w-full mb-6">
            <RadialProgressBar value={score} size={80} strokeWidth={7} />
          </div>
          <h3 className="text-xl lg:text-2xl font-semibold text-zinc-100 leading-tight mb-4">
            {result.job_details.job_title}
          </h3>
          <div className="space-y-2.5 text-zinc-300 text-sm font-normal mb-8">
            <div
              className="flex items-center justify-center lg:justify-start gap-2"
              title="Company"
            >
              <Building size={16} className="text-zinc-500" />
              <span>{result.job_details.company_name || "N/A"}</span>
            </div>
            <div
              className="flex items-center justify-center lg:justify-start gap-2"
              title="Location"
            >
              <MapPin size={16} className="text-zinc-500" />
              <span>{result.job_details.location || "N/A"}</span>
            </div>
            <div
              className="flex items-center justify-center lg:justify-start gap-2"
              title="Job Type"
            >
              <Clock size={16} className="text-zinc-500" />
              <span>{result.job_details.job_type || "N/A"}</span>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 w-full max-w-xs mx-auto lg:mx-0">
            {/* Apply Now Button */}
            <motion.a
              whileHover={{
                scale: !result.job_details.apply_link ? 1 : 1.03,
                y: !result.job_details.apply_link ? 0 : -2,
                boxShadow: !result.job_details.apply_link
                  ? "none"
                  : `0 10px 25px -5px ${statusInfo.shadow
                      .replace("shadow-", "rgba(")
                      .replace("/30", ", 0.4)")}`,
              }}
              whileTap={
                !result.job_details.apply_link ? {} : { scale: 0.97, y: 0 }
              }
              href={result.job_details.apply_link ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-3 bg-gradient-to-r ${applyButtonGradient} text-white rounded-lg transition-all duration-300 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md ${applyButtonShadow} ${applyButtonHoverShadow} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${applyButtonFocusRing} ${
                !result.job_details.apply_link
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-disabled={!result.job_details.apply_link}
              onClick={(e) =>
                !result.job_details.apply_link && e.preventDefault()
              }
            >
              <span>Apply Now</span> <ExternalLink size={16} />
            </motion.a>

            {/* Advanced Analysis Button */}
            <motion.button
              whileHover={{
                scale: !isAnalyzing ? 1.03 : 1,
                backgroundColor: !isAnalyzing
                  ? "rgba(63, 63, 70, 0.7)"
                  : "rgba(63, 63, 70, 0.4)",
              }}
              whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
              onClick={handleAdvancedAnalysisClick}
              disabled={isAnalyzing}
              title={
                isAnalyzing
                  ? "Analyzing..."
                  : "Perform advanced analysis on this match"
              }
              className={`px-4 py-2.5 bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300 hover:text-zinc-100 rounded-lg transition-all duration-200 text-sm font-medium inline-flex items-center justify-center gap-2 border border-zinc-700/70 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-zinc-950 focus:ring-zinc-500 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isAnalyzing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Code size={16} />
              )}
              <span>{isAnalyzing ? "Analyzing..." : "Advance Analysis"}</span>
            </motion.button>
          </div>
        </div>

        {/* === Right Column: Detailed Analysis === */}
        <div className="lg:col-span-8 space-y-8 pt-1">
          <div>
            <h4 className="text-lg font-medium text-zinc-200 mb-4 flex items-center gap-2.5">
              <BarChart size={20} className="text-sky-400" /> Match Analysis
            </h4>
            <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg p-5 space-y-1.5 backdrop-blur-sm">
              {Object.entries(result.score_breakdown).map(
                ([category, value]) => (
                  <CategoryScoreItem
                    key={category}
                    name={category}
                    value={value}
                  />
                )
              )}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-zinc-200 mb-4 flex items-center gap-2.5">
              <Info size={20} className="text-purple-400" /> AI Summary
            </h4>
            <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/30 border border-zinc-700/60 rounded-lg p-5 backdrop-blur-sm">
              <p className="text-zinc-300 text-sm leading-relaxed font-normal">
                {result.explanation || "No summary available."}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {result.matching_skills?.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-zinc-200 mb-3.5 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  Strong Skills ({result.matching_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {result.matching_skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} type="matching" />
                  ))}
                </div>
              </div>
            )}
            {result.missing_skills?.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-zinc-200 mb-3.5 flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" />
                  Skill Gaps ({result.missing_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {result.missing_skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} type="missing" />
                  ))}
                </div>
              </div>
            )}
            {(result.matching_skills?.length ?? 0) === 0 &&
              (result.missing_skills?.length ?? 0) === 0 && (
                <div className="sm:col-span-2 text-center text-zinc-500 text-sm py-4">
                  No specific skill matches or gaps identified.
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// --- Main Page Component ---
export default function AnalysisResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // --- Store Interaction ---
  const results = useAnalysisStore((state) => state.results);
  const jobIds = useAnalysisStore((state) => state.jobIds);

  // --- State ---
  const [displayMatches, setDisplayMatches] = useState<JobMatchResult[]>([]);
  const [parsedResumeId, setParsedResumeId] = useState<
    number | null | undefined
  >(undefined);

  // --- Mutation Hook ---
  const { mutate: triggerAdvancedAnalysis, isPending: isAnalyzing } =
    useLLMComprehensiveAnalysis();

  // --- Effect Hook for Data Processing ---
  useEffect(() => {
    setIsLoading(true);

    if (!results) {
      if (jobIds?.length > 0) {
        toast.warning("Analysis data missing. Returning to matching.");
      }
      router.push(`/match${jobIds ? `?jobs=${jobIds}` : ""}`);
      return;
    }

    const parseResult = MatchResponseSchema.safeParse(results);
    if (!parseResult.success) {
      console.error("Validation Error:", parseResult.error.flatten());
      toast.error("Invalid analysis results structure");
      router.push(`/match${jobIds ? `?jobs=${jobIds}` : ""}`);
      return;
    }

    const validatedData = parseResult.data;
    const matches = validatedData.matches ?? [];
    setParsedResumeId(validatedData.parsed_resume_id);
    setDisplayMatches(
      [...matches].sort((a, b) => b.overall_score - a.overall_score)
    );

    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [results, router, jobIds]);

  // --- Memoized Calculations ---
  const highestMatchScore = useMemo(
    () => Math.max(...displayMatches.map((r) => r.overall_score)),
    [displayMatches]
  );

  const averageScore = useMemo(
    () =>
      displayMatches.reduce((sum, r) => sum + r.overall_score, 0) /
      displayMatches.length,
    [displayMatches]
  );

  // --- Helper Function ---
  const getMatchLabel = (score: number) => {
    if (score >= 0.8) return "Excellent Match";
    if (score >= 0.6) return "Good Match";
    if (score >= 0.4) return "Moderate Match";
    return "Weak Match";
  };

  const averageMatchQuality = useMemo(() => {
    const statusInfo = getStatusInfo(averageScore);
    return {
      label: getMatchLabel(averageScore),
      icon: <statusInfo.icon size={24} className={statusInfo.text} />,
      colorClass: statusInfo.text,
    };
  }, [averageScore]);

  // --- Conditional Loading State ---
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
          <div className="flex flex-col items-center text-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin text-brand-accent-from" />
            <p className="text-zinc-200 text-xl font-medium">
              Analyzing Matches
            </p>
            <p className="text-zinc-400 text-base font-light animate-pulse">
              Crafting your results...
            </p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // --- Summary Data ---
  const summaryData = [
    {
      icon: <FileText size={24} className="text-white" />,
      title: "Jobs Analyzed",
      value: `${displayMatches.length}`,
      valueColorClass: "text-zinc-100",
    },
    {
      icon: averageMatchQuality.icon,
      title: "Average Match",
      value: `${Math.round(averageScore * 100)}%`,
      description: averageMatchQuality.label,
      valueColorClass: averageMatchQuality.colorClass,
    },
    {
      icon: <TrendingUp size={24} className="text-white" />,
      title: "Highest Match",
      value: `${Math.round(highestMatchScore * 100)}%`,
      description: displayMatches[0]?.job_details.job_title || "N/A",
      valueColorClass: getStatusInfo(highestMatchScore).text,
    },
  ];

  // --- Main Render ---
  return (
    <PublicLayout>
      <div className="fixed inset-0 -z-20 overflow-hidden bg-zinc-950 pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[45rem] h-[45rem] bg-gradient-radial from-brand-accent-from/8 via-transparent to-transparent blur-3xl -translate-x-1/2 opacity-60 animate-pulse-slow`}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[45rem] h-[45rem] bg-gradient-radial from-brand-accent-to/8 via-transparent to-transparent blur-3xl translate-x-1/2 opacity-60 animate-pulse-slow animation-delay-3000`}
        ></div>
      </div>

      <div className="bg-transparent text-white min-h-screen font-sans relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-14 md:mb-20"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8">
              <h1
                className={`text-4xl md:text-5xl font-bold ${ACCENT_TEXT_GRADIENT} flex items-center gap-3.5`}
              >
                <Sparkles className="w-10 h-10 opacity-90 text-brand-accent-to" />
                <span>Analysis Results</span>
              </h1>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  router.push(`/match${jobIds ? `?jobs=${jobIds}` : ""}`)
                }
                className="px-5 py-2.5 bg-zinc-800/70 text-zinc-200 hover:text-white rounded-lg transition-all duration-300 flex items-center gap-2 text-sm border border-zinc-700 shadow-sm group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-brand-accent-to"
              >
                <ArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to Match</span>
              </motion.button>
            </div>
            <p className="text-zinc-300 text-lg md:text-xl max-w-3xl font-normal">
              Here&apos;s how your profile aligns with {displayMatches.length}{" "}
              {displayMatches.length === 1 ? "opportunity" : "opportunities"}.
              Results sorted by highest match score.
            </p>
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 md:mb-20"
          >
            {summaryData.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.35 + i * 0.12,
                  ease: "easeOut",
                }}
                className="bg-zinc-900/50 border border-zinc-700/40 rounded-xl p-6 backdrop-blur-lg shadow-lg flex items-start gap-5 transition-all duration-200 hover:bg-zinc-800/60 hover:border-zinc-600/60"
              >
                <div
                  className={`p-3 bg-gradient-to-br ${ACCENT_GRADIENT} rounded-lg mt-1 flex-shrink-0 shadow-inner shadow-white/10`}
                >
                  {item.icon}
                </div>
                <div className="flex-grow">
                  <p className="text-zinc-400 text-sm font-medium mb-1">
                    {item.title}
                  </p>
                  <h2
                    className={`text-2xl font-semibold ${item.valueColorClass} leading-tight`}
                  >
                    {item.value}
                  </h2>
                  {item.description && (
                    <p className="text-xs text-zinc-500 mt-1.5 font-normal truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Results List */}
          <AnimatePresence mode="popLayout">
            <motion.div layout className="space-y-8 md:space-y-10">
              {displayMatches.map((matchResult, index) => (
                <JobMatchCard
                  key={matchResult.job_id}
                  result={matchResult}
                  parsedResumeId={parsedResumeId}
                  index={index}
                  onAdvancedAnalysisClick={triggerAdvancedAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results Message */}
          {displayMatches.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-24"
            >
              <Target size={52} className="mx-auto text-zinc-600 mb-6" />
              <p className="text-zinc-300 text-xl mb-3">
                No Matching Results Found
              </p>
              <p className="text-zinc-500 text-base font-light max-w-md mx-auto">
                We couldn&apos;t find any jobs matching your profile. Try
                analyzing different job postings.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/match")}
                className={`mt-8 px-5 py-2.5 bg-gradient-to-r ${ACCENT_GRADIENT} text-white rounded-lg transition-all duration-300 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-brand-accent-to`}
              >
                Analyze More Jobs
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
