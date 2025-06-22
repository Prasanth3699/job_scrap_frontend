import { Job } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds?: number): string {
  const validSeconds = Number(seconds);
  if (isNaN(validSeconds) || validSeconds <= 0) return "0s";

  const hours = Math.floor(validSeconds / 3600);
  const minutes = Math.floor((validSeconds % 3600) / 60);
  const remainingSeconds = Math.floor(validSeconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
}

export function getRelatedJobs(currentJob: Job, allJobs: Job[]): Job[] {
  // Remove current job from consideration
  const otherJobs = allJobs.filter((job) => job.id !== currentJob.id);

  // Calculate similarity scores
  const jobsWithScores = otherJobs.map((job) => ({
    job,
    score: calculateSimilarityScore(currentJob, job),
  }));

  // Sort by score and return top 3
  return jobsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.job);
}

function calculateSimilarityScore(job1: Job, job2: Job): number {
  let score = 0;

  // Title similarity (higher weight)
  if (
    job1.job_title.toLowerCase().includes(job2.job_title.toLowerCase()) ||
    job2.job_title.toLowerCase().includes(job1.job_title.toLowerCase())
  ) {
    score += 5;
  }

  // Job type match
  if (job1.job_type === job2.job_type) {
    score += 3;
  }

  // Location match
  if (job1.location === job2.location) {
    score += 2;
  }

  // Experience level match
  if (job1.experience === job2.experience) {
    score += 2;
  }

  // Salary range similarity
  const salary1 = parseSalary(job1.salary);
  const salary2 = parseSalary(job2.salary);
  if (Math.abs(salary1 - salary2) < 20000) {
    score += 1;
  }

  return score;
}

function parseSalary(salary: string): number {
  // Basic salary parsing (you might need to adjust based on your salary format)
  const match = salary.match(/\d+/g);
  return match ? parseInt(match[0]) : 0;
}
