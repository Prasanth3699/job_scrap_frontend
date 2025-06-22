import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { toast } from "sonner";
import { ErrorEvent, AnalyticsEvent } from "./types";

export class MonitoringService {
  private static instance: MonitoringService;

  private constructor() {
    this.initializeSentry();
    this.initializePostHog();
  }

  private initializeSentry(): void {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_ENV,
      tracesSampleRate: 1.0,
    });
  }

  private initializePostHog(): void {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
      });
    }
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  trackError({ message, error, user, metadata }: ErrorEvent): void {
    console.error(message, error);

    Sentry.withScope((scope) => {
      if (user) {
        scope.setUser(user);
      }
      if (metadata) {
        scope.setExtras(metadata);
      }
      Sentry.captureException(error);
    });

    posthog.capture("error", {
      error_message: message,
      error_stack: error.stack,
      ...metadata,
    });

    toast.error(message);
  }

  trackEvent({ name, properties, user }: AnalyticsEvent): void {
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
