export interface User {
  id: string;
  name: string;
  email: string;
  accessToken?: string;
  is_admin: boolean;
  is_active: boolean;
}

export interface AdminUser extends User {
  is_admin: true;
}

export interface AdminRegistrationData {
  name: string;
  email: string;
  password: string;
  admin_secret_key: string;
}

export interface AdminDashboardStats extends DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
}

export interface UserManagement {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface Job {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary: string;
  experience: string;
  posting_date: string;
  description?: string;
  apply_link: string;
  tags?: string[];
}
export interface JobFilters {
  locations: string[];
  jobTypes: string[];
  experienceLevels: string[];
  salaryRange: {
    min: number;
    max: number;
  } | null;
  searchQuery: string;
}

export interface JobsState {
  jobs: Job[];
  filters: JobFilters;
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
}

export interface ScrapingStats {
  todayJobs: number;
  totalJobs: number;
  avgScrapeTime: string;
  successRate: number;
  lastScrapeTime: string;
}

export interface EmailConfig {
  smtp_server: string;
  smtp_port: number;
  email_sender: string;
  email_password: string;
  email_receiver: string;
}

export interface SchedulerConfig {
  scrape_schedule_hour: number;
  scrape_schedule_minute: number;
  enabled: boolean;
}

interface Settings {
  email_config: EmailConfig;
  scheduler_config: SchedulerConfig;
  selenium_config?: Record<string, unknown>;
}

// Define an error type
interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message: string;
}

export interface CronConfig {
  schedule: string;
  enabled: boolean;
  lastRun: string;
}

export interface ScrapingHistoryItem {
  id: number;
  start_time: string;
  end_time: string | null;
  jobs_found: number;
  status: string;
  error: string | null;
}

export interface ApiResponse<T> {
  is_admin: boolean | undefined;
  id: int;
  access_token: string;
  refresh_token: string;
  user: User | null | undefined;
  data: T;
  message?: string;
  success: boolean;
}

export interface EmailConfigResponse {
  config: EmailConfig;
  message: string;
}

export interface SchedulerConfigResponse {
  config: SchedulerConfig;
  message: string;
}

export interface DashboardStats {
  stats: {
    todayJobs: number;
    totalJobs: number;
    successRate: number;
    avgScrapeTime: string;
    lastScrapeTime: string | null;
  };
  jobsByCategory: Array<{ name: string; value: number }>;
  successRate: Array<{ name: string; value: number }>;
  scrapingHistory: Array<{
    id: number;
    start_time: string;
    end_time: string | null;
    jobs_found: number;
    status: string;
    error: string | null;
  }>;
}

export enum UserProfileStatus {
  INCOMPLETE = "incomplete",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface UserProfile {
  id?: number;
  user_id: number;
  profile_status: UserProfileStatus;
  current_role?: string;
  domains?: string[];
  professional_title?: string;
  career_stage?: string;
  experience_level?: string;
  resume_file_path?: string;
  resume_uploaded_at?: string;
}

export interface ScrapingSession {
  id: number;
  startTime: string;
  endTime: string | null;
  jobsScraped: number;
  status: string;
  error: string | null;
}

export interface JobsOverTime {
  date: string;
  count: number;
}

export interface ScrapingHistory {
  recentSessions: ScrapingSession[];
  jobsOverTime: JobsOverTime[];
}

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string[];
  jobType?: string[];
  experience?: string[];
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobSourceResponse {
  data: JobSource[]; // Update to match your API response structure
}

export interface ScrapingConfig {
  max_jobs: number;
  scroll_pause_time: number;
  element_timeout: number;
}

export interface JobSource {
  id: number;
  name: string;
  url: string;
  is_active: boolean;
  scraping_config: ScrapingConfig;
  last_scraped_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobSourceFormData {
  name: string;
  url: string;
  is_active: boolean;
  scraping_config: ScrapingConfig;
}

export type JobSourceUpdateData = Partial<
  Omit<JobSourceFormData, "scraping_config">
> & {
  scraping_config?: Partial<ScrapingConfig>;
};

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

export interface MLResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MLProcessingResult {
  success: boolean;
  data: {
    similarity_scores: number[][];
    processed_jobs: number[];
    recommendations: Record<number, Array<{ job_id: number; score: number }>>;
  };
}

export interface MLRecommendation {
  job_id: number;
  score: number;
}
