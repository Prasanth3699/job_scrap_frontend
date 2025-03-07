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
