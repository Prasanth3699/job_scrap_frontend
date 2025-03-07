export interface ErrorEvent {
  message: string;
  error: Error;
  user?: {
    id: string;
    email: string;
  };
  metadata?: Record<string, any>;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  user?: {
    id: string;
    email: string;
  };
}
