/**
 * This file defines all API endpoints used across services.
 * Centralizing these makes it easier to track and update API paths.
 */

// Core API Endpoints
export const CORE_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REGISTER_ADMIN: "/auth/admin/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  PROFILE: "/auth/me",
  UPDATE_PROFILE: "/auth/profile",

  // Users
  USERS: "/admin/users",
  USER_STATUS: (userId: string) => `/admin/users/${userId}/status`,

  // Jobs
  JOBS: "/jobs",
  JOBS_DASHBOARD: "/jobs/dashboard",
  JOB_BY_ID: (id: string) => `/jobs/${id}`,
  RELATED_JOBS: (jobId: string) => `/jobs/${jobId}/related`,
  RECENT_JOBS: "/jobs/recent",
  TRIGGER_SCRAPE: "/jobs/scrape",

  // Job Sources
  JOB_SOURCES: "/job-sources",
  JOB_SOURCE_BY_ID: (id: number) => `/job-sources/${id}`,

  // Settings
  SETTINGS: "/settings",
  EMAIL_CONFIG: "/settings/email",
  SCHEDULER_CONFIG: "/settings/scheduler",

  // Stats
  DASHBOARD_STATS: "/stats/dashboard-stats",
  SCRAPING_HISTORY: "/stats/scraping-history",

  // Profile
  PROFILE_ONBOARDING: "/profile/onboarding",
  UPLOAD_RESUME: "/profile/upload-resume",
  GET_PROFILE: "/profile",
};

// ML Service Endpoints
export const ML_ENDPOINTS = {
  // Matching
  NEW_MATCHES: "/matching/new-matchs",
  PROCESS_JOBS: "/process-jobs",
  JOB_RECOMMENDATIONS: (jobId: number) => `/recommendations/${jobId}`,

  // Analytics
  MARKET_SALARIES: "/market/salaries",
  MARKET_SKILLS: "/market/skills",
  USER_PREFERENCES: (userId: string) => `/user/preferences/${userId}`,
  USER_ENGAGEMENT: "/user/engagement",
  SALARY_COMPARE: "/salary/compare",
  JOB_AVAILABILITY: "/market/jobs/availability",

  // Websockets
  WS_REALTIME: "/ws",
};

// LLM Service Endpoints
export const LLM_ENDPOINTS = {
  ANALYZE: "/advanced-analysis/analyze",
  SKILL_GAPS: "/analyze/skill-gaps",
  ATS_SCORE: "/analyze/ats",
  EXTRACT_KEYWORDS: "/analyze/keywords",
};
