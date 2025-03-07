import { useEffect } from "react";
import { monitoring } from "@/lib/monitoring";
import { useAuth } from "./auth/use-auth";

export function useAnalytics() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      monitoring.trackEvent({
        name: "user_session_start",
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }
  }, [user]);

  return {
    trackEvent: monitoring.trackEvent.bind(monitoring),
    trackError: monitoring.trackError.bind(monitoring),
  };
}
