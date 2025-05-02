// stores/analysis-schema.ts
import { z } from "zod";

// Define the schema for the job details
export const JobDetailsSchema = z
  .object({
    job_title: z.string(),
    company_name: z.string(),
    location: z.string(),
    job_type: z.string(),
    apply_link: z.string().nullable().optional(),
  })
  .passthrough();

// Define the schema for the score breakdown
export const ScoreBreakdownSchema = z.record(z.number());

export const JobMatchResultSchema = z
  .object({
    job_id: z.string(),
    original_job_id: z.number().nullable().optional(),
    overall_score: z.number(),
    score_breakdown: ScoreBreakdownSchema,
    missing_skills: z.array(z.string()),
    matching_skills: z.array(z.string()),
    explanation: z.string(),
    job_details: JobDetailsSchema,
  })
  .passthrough();
// Define the AnalysisResult schema
export const AnalysisResultSchema = z.object({
  job_id: z.string(),
  original_job_id: z.number().nullable().optional(),
  overall_score: z.number(),
  score_breakdown: ScoreBreakdownSchema,
  missing_skills: z.array(z.string()),
  matching_skills: z.array(z.string()),
  explanation: z.string(),
  job_details: JobDetailsSchema,
});

export const MatchResponseSchema = z.object({
  matches: z.array(JobMatchResultSchema),
  parsed_resume_id: z.number().nullable().optional(),
});

// Define the type alias if used elsewhere
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
// Define the type for the overall response
export type JobDetails = z.infer<typeof JobDetailsSchema>;
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;
export type JobMatchResult = z.infer<typeof JobMatchResultSchema>;
export type MatchResponse = z.infer<typeof MatchResponseSchema>;
