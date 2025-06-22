"use client";
import { Keywords } from "@/types/index";
import clsx from "clsx";
import { Code, Heart, Lightbulb, Zap } from "lucide-react";

interface Props {
  keywords: Keywords;
  className?: string;
}

export default function KeywordsSection({ keywords, className }: Props) {
  return (
    <div
      className={clsx(
        "rounded-xl border overflow-hidden bg-zinc-900 shadow-lg dark:border-zinc-700",
        className
      )}
    >
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
        <Code className="h-5 w-5 text-indigo-400" />
        <h2 className="text-lg font-semibold">Keywords Analysis</h2>
      </div>

      <div className="p-6 space-y-8">
        <KeywordCategory
          title="Technical Skills"
          icon={<Code className="h-5 w-5" />}
          items={keywords.technical_skills}
          colorName="indigo"
        />

        <KeywordCategory
          title="Soft Skills"
          icon={<Heart className="h-5 w-5" />}
          items={keywords.soft_skills}
          colorName="emerald"
        />

        <KeywordCategory
          title="Industry Terms"
          icon={<Lightbulb className="h-5 w-5" />}
          items={keywords.industry_terms}
          colorName="amber"
        />

        <KeywordCategory
          title="Action Verbs"
          icon={<Zap className="h-5 w-5" />}
          items={keywords.action_verbs}
          colorName="rose"
        />
      </div>
    </div>
  );
}

interface KeywordCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  colorName: "indigo" | "emerald" | "amber" | "rose" | "purple" | "blue";
}

function KeywordCategory({
  title,
  icon,
  items,
  colorName,
}: KeywordCategoryProps) {
  if (!items.length) return null;

  const getColorClasses = () => {
    const colorMap = {
      indigo: {
        bg: "bg-indigo-900/40",
        text: "text-indigo-400",
        badge:
          "bg-indigo-900/30 text-indigo-400 border-indigo-700/30 hover:bg-indigo-800/50",
      },
      emerald: {
        bg: "bg-emerald-900/40",
        text: "text-emerald-400",
        badge:
          "bg-emerald-900/30 text-emerald-400 border-emerald-700/30 hover:bg-emerald-800/50",
      },
      amber: {
        bg: "bg-amber-900/40",
        text: "text-amber-400",
        badge:
          "bg-amber-900/30 text-amber-400 border-amber-700/30 hover:bg-amber-800/50",
      },
      rose: {
        bg: "bg-rose-900/40",
        text: "text-rose-400",
        badge:
          "bg-rose-900/30 text-rose-400 border-rose-700/30 hover:bg-rose-800/50",
      },
      purple: {
        bg: "bg-purple-900/40",
        text: "text-purple-400",
        badge:
          "bg-purple-900/30 text-purple-400 border-purple-700/30 hover:bg-purple-800/50",
      },
      blue: {
        bg: "bg-blue-900/40",
        text: "text-blue-400",
        badge:
          "bg-blue-900/30 text-blue-400 border-blue-700/30 hover:bg-blue-800/50",
      },
    };

    return colorMap[colorName];
  };

  const { bg, text, badge } = getColorClasses();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${bg} ${text}`}
        >
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((keyword) => (
          <span
            key={keyword}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${badge}`}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
