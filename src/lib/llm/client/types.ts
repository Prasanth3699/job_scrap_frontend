export interface ResumeJobRequest {
  // resume: string;
  // job_description: string;

  original_job_id?: number | string | null;
  parsed_resume_id?: number | string | null;
}

export interface SkillGap {
  skill: string;
  priority: "High" | "Medium" | "Low";
  current_level: string;
  required_level: string;
  improvement_suggestions: string[];
}

export interface ATSAnalysis {
  score: number;
  keyword_match_rate: number;
  missing_keywords: string[];
  format_suggestions: string[];
  content_improvements: string[];
}

export interface ImprovementPlan {
  skill: string;
  timeline_weeks: number;
  resources: string[];
  projects: string[];
  certifications: string[];
  estimated_cost: string;
}

export interface Keywords {
  technical_skills: string[];
  soft_skills: string[];
  industry_terms: string[];
  action_verbs: string[];
}

export interface JobAnalysisResult {
  timestamp: string;
  skill_gaps: SkillGap[];
  ats_analysis: ATSAnalysis;
  improvement_plan: ImprovementPlan[];
  keywords: Keywords;
}
