import { JobAnalysisResult } from "@/lib/llm/client/types";
import AtsCard from "./AtsCard";
import SkillGapsTable from "./SkillGapsTable";
import ImprovementAccordion from "./ImprovementAccordion";
import KeywordsSection from "./KeywordsSection";

interface Props {
  result: JobAnalysisResult;
}

export default function AnalysisDashboard({ result }: Props) {
  return (
    <section className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200 bg-clip-text text-transparent">
          Profile Analysis
        </h1>
        <p className="mt-2 text-zinc-400">
          Here&apos;s a comprehensive breakdown of your professional profile and
          improvement opportunities
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* ATS score & meta */}
        <AtsCard ats={result.ats_analysis} className="lg:col-span-4" />

        {/* Skill gaps */}
        <SkillGapsTable gaps={result.skill_gaps} className="lg:col-span-8" />

        {/* Improvement plan accordion */}
        <ImprovementAccordion
          plans={result.improvement_plan}
          className="lg:col-span-7"
        />

        {/* Keywords */}
        <KeywordsSection keywords={result.keywords} className="lg:col-span-5" />
      </div>
    </section>
  );
}
