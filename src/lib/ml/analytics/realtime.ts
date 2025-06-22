// lib/ml/analytics/realtime.ts
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring";

class RealTimeAnalyticsClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(callback: (data: any) => void) {
    if (this.socket) return;

    const token = security.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const wsUrl = new URL(process.env.NEXT_PUBLIC_ML_WS_URL!);
    wsUrl.searchParams.set("token", token);

    this.socket = new WebSocket(wsUrl.toString());

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      monitoring.trackEvent({
        name: "realtime_connection_established",
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Validate message signature if present
        if (data.signature && !security.validateMessageSignature(data)) {
          monitoring.trackError({
            message: "Invalid message signature",
            error: new Error("Invalid message signature"),
            metadata: { data },
          });
          return;
        }

        callback(data);
      } catch (error) {
        monitoring.trackError({
          message: "Failed to parse WebSocket message",
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    this.socket.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(callback);
        }, 1000 * this.reconnectAttempts);
      }
    };

    this.socket.onerror = (error) => {
      monitoring.trackError({
        message: "WebSocket error",
        error: new Error("WebSocket error occurred"),
      });
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const realtimeClient = new RealTimeAnalyticsClient();
