// components/AnalysisDashboard/AnalysisDashboard.tsx
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
    <section className="grid gap-6 lg:grid-cols-12">
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
    </section>
  );
}
