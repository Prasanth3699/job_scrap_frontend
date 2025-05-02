// components/AnalysisDashboard/KeywordsSection.tsx
import { Keywords } from "@/lib/llm/client/types";
import clsx from "clsx";

interface Props {
  keywords: Keywords;
  className?: string;
}

export default function KeywordsSection({ keywords, className }: Props) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-6 rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800",
        className
      )}
    >
      <KeywordGroup
        title="Technical"
        items={keywords.technical_skills}
        color="indigo"
      />
      <KeywordGroup
        title="Soft Skills"
        items={keywords.soft_skills}
        color="emerald"
      />
      <KeywordGroup
        title="Industry Terms"
        items={keywords.industry_terms}
        color="amber"
      />
      <KeywordGroup
        title="Action Verbs"
        items={keywords.action_verbs}
        color="rose"
      />
    </div>
  );
}

function KeywordGroup({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((kw) => (
          <span
            key={kw}
            className={`whitespace-nowrap rounded-full bg-${color}-100 px-3 py-1 text-xs font-medium text-${color}-700 dark:bg-${color}-700/20 dark:text-${color}-300`}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
