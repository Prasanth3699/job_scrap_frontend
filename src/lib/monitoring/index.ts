import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { toast } from "sonner";

interface ErrorEvent {
  message: string;
  error: Error;
  user?: {
    id: string;
    email: string;
  };
  metadata?: Record<string, any>;
}

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  user?: {
    id: string;
    email: string;
  };
}

export class MonitoringService {
  private static instance: MonitoringService;

  private constructor() {
    // Initialize Sentry
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_ENV,
      tracesSampleRate: 1.0,
    });

    // Initialize PostHog
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  trackError({ message, error, user, metadata }: ErrorEvent): void {
    console.error(message, error);

    // Send to Sentry
    Sentry.withScope((scope) => {
      if (user) {
        scope.setUser(user);
      }
      if (metadata) {
        scope.setExtras(metadata);
      }
      Sentry.captureException(error);
    });

    // Log to PostHog
    posthog.capture("error", {
      error_message: message,
      error_stack: error.stack,
      ...metadata,
    });

    // Show user feedback
    toast.error(message);
  }

  trackEvent({ name, properties, user }: AnalyticsEvent): void {
    // Track in PostHog
    posthog.capture(name, {
      ...properties,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    });
  }

  startPerformanceTracking(operationName: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.trackEvent({
        name: "performance_metric",
        properties: {
          operation: operationName,
          duration_ms: duration,
        },
      });
    };
  }
}

export const monitoring = MonitoringService.getInstance();
