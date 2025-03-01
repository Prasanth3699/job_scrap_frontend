export interface User {
  id: string;
  name: string;
  email: string;
  accessToken?: string;
}

interface Job {
  id: string;
  company_name: string;
  job_title: string;
  job_type: string;
  salary: string;
  experience: string;
  location: string;
  posting_date: string;
  apply_link: string;
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
  data: T;
  message?: string;
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

// Types
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

interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
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
