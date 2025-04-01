// lib/ml/analytics/types.ts

export interface MLResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface SalaryComparisonResult {
  current_salary: number;
  market_median: number;
  percentile: number;
  comparison: string;
  location_adjusted?: number;
  location_adjustment_factor?: number;
}

export interface SalaryTrendsData {
  overall_monthly: {
    month: string;
    median_salary: number;
    average_salary: number;
    percentile_25: number;
    percentile_75: number;
  }[];
  by_experience: {
    experience_level: string;
    monthly_trends: {
      month: string;
      median_salary: number;
    }[];
  }[];
  by_company_size: {
    company_size: string;
    median_salary: number;
  }[];
  by_industry: {
    industry: string;
    median_salary: number;
    salary_range: [number, number];
  }[];
}

export interface SkillDemandData {
  time_period: string;
  total_jobs_analyzed: number;
  top_skills: {
    skill: string;
    demand_score: number;
    growth_rate: number;
    average_salary: number;
  }[];
  skill_categories: {
    category: string;
    skills: {
      skill: string;
      demand_score: number;
    }[];
  }[];
  emerging_skills: {
    skill: string;
    growth_rate: number;
    adoption_rate: number;
  }[];
}

export interface UserPreferencesData {
  preferred_job_types: {
    job_type: string;
    preference_score: number;
  }[];
  preferred_locations: {
    location: string;
    preference_score: number;
  }[];
  preferred_industries: {
    industry: string;
    preference_score: number;
  }[];
  preferred_company_sizes: string[];
  preferred_salary_ranges: {
    range: [number, number];
    preference_score: number;
  }[];
  preferred_benefits: string[];
  average_salary_preference?: number;
  success_rate_by_match_score: Record<string, number>;
}

export interface UserEngagementData {
  total_users: number;
  daily_active_users_avg: number;
  daily_active_users_median: number;
  actions_per_user_avg: number;
  actions_per_user_median: number;
  conversion_funnel: {
    impression: number;
    click: number;
    apply: number;
    hired: number;
  };
  conversion_rates: {
    impression_to_click: number;
    click_to_apply: number;
    apply_to_hired: number;
  };
  engagement_by_time: {
    hour: number;
    active_users: number;
  }[];
  engagement_by_device: {
    device_type: string;
    percentage: number;
  }[];
}

export interface JobMarketInsights {
  total_jobs: number;
  jobs_by_industry: {
    industry: string;
    count: number;
    growth_rate: number;
  }[];
  jobs_by_location: {
    location: string;
    count: number;
    remote_ratio: number;
  }[];
  jobs_by_seniority: {
    seniority: string;
    count: number;
    average_salary: number;
  }[];
  remote_jobs_trend: {
    month: string;
    remote_jobs: number;
    hybrid_jobs: number;
    on_site_jobs: number;
  }[];
}

export interface JobAvailabilityData {
  time_period: string;
  trends: {
    date: string;
    open_positions: number;
    filled_positions: number;
    ratio: number;
  }[];
}
