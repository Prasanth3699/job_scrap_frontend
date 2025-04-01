// stores/analysis-schema.ts
import { z } from "zod";

export const JobDetailsSchema = z.object({
  job_title: z.string(),
  company_name: z.string(),
  location: z.string(),
  job_type: z.string(),
  apply_link: z.string().url(),
});

export const ScoreBreakdownSchema = z.object({
  skills: z.number(),
  experience: z.number(),
  salary: z.number(),
  title: z.number(),
  location: z.number(),
  job_type: z.number(),
  company: z.number(),
});

export const AnalysisResultSchema = z.object({
  job_id: z.string(),
  overall_score: z.number(),
  score_breakdown: ScoreBreakdownSchema,
  missing_skills: z.array(z.string()),
  matching_skills: z.array(z.string()),
  explanation: z.string(),
  job_details: JobDetailsSchema,
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
