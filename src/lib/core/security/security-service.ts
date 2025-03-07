// lib/core/security/security-service.ts
import { AES, enc } from "crypto-js";
import { jwtDecode } from "jwt-decode";
import { SecurityConfig, TokenPayload, SecurityHeaders } from "./types";

export class SecurityService {
  private static instance: SecurityService;
  private readonly config: SecurityConfig;

  private constructor() {
    this.config = {
      tokenKey: "token",
      refreshTokenKey: "refresh_token",
      encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY!,
      tokenExpiry: 30, // 30 minutes
      refreshTokenExpiry: 7, // 7 days
    };

    if (!this.config.encryptionKey) {
      throw new Error("Encryption key is not configured");
    }
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Token Management
  setToken(token: string, isRefreshToken: boolean = false): void {
    try {
      const key = isRefreshToken
        ? this.config.refreshTokenKey
        : this.config.tokenKey;

      // Store both encrypted and unencrypted versions
      localStorage.setItem(key, token); // Unencrypted for direct access
      localStorage.setItem(`${key}_encrypted`, this.encrypt(token)); // Encrypted for security
    } catch (error) {
      console.error("Error storing token:", error);
      // Fallback to unencrypted storage
      localStorage.setItem(this.config.tokenKey, token);
    }
  }

  getToken(isRefreshToken: boolean = false): string | null {
    try {
      const key = isRefreshToken
        ? this.config.refreshTokenKey
        : this.config.tokenKey;

      // Try getting encrypted token first
      const encryptedToken = localStorage.getItem(`${key}_encrypted`);
      if (encryptedToken) {
        try {
          const decrypted = this.decrypt(encryptedToken);
          if (this.validateToken(decrypted)) {
            return decrypted;
          }
        } catch (e) {
          console.error("Error decrypting token:", e);
        }
      }

      // Fallback to unencrypted token
      const token = localStorage.getItem(key);
      if (token && this.validateToken(token)) {
        return token;
      }

      return null;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  }

  clearToken(isRefreshToken: boolean = false): void {
    const key = isRefreshToken
      ? this.config.refreshTokenKey
      : this.config.tokenKey;
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_encrypted`);
  }

  clearAllTokens(): void {
    this.clearToken(false);
    this.clearToken(true);
  }

  // Token Validation
  validateToken(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (!decoded.exp) return false;

      // Add buffer time (30 seconds) to prevent edge cases
      const bufferTime = 30 * 1000;
      return Date.now() + bufferTime < decoded.exp * 1000;
    } catch {
      return false;
    }
  }

  getTokenPayload(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  // Encryption
  private encrypt(data: string): string {
    return AES.encrypt(data, this.config.encryptionKey).toString();
  }

  private decrypt(encrypted: string): string {
    const bytes = AES.decrypt(encrypted, this.config.encryptionKey);
    return bytes.toString(enc.Utf8);
  }

  // Security Headers
  getSecurityHeaders(): SecurityHeaders {
    return {
      "Content-Security-Policy": this.getCSPPolicy(),
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-XSS-Protection": "1; mode=block",
    };
  }

  private getCSPPolicy(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL} ${process.env.NEXT_PUBLIC_ML_SERVICE_URL}`,
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "block-all-mixed-content",
      "upgrade-insecure-requests",
    ].join("; ");
  }

  // Session Management
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.validateToken(token);
  }

  getUserRole(): "admin" | "user" | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.getTokenPayload(token);
    return payload?.is_admin ? "admin" : "user";
  }

  // Token Refresh Logic
  async refreshTokenIfNeeded(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.getTokenPayload(token);
    if (!payload) return false;

    // Refresh if token will expire in less than 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    const shouldRefresh = payload.exp * 1000 - Date.now() < fiveMinutes;

    if (shouldRefresh) {
      const refreshToken = this.getToken(true);
      if (!refreshToken) return false;

      try {
        // Implement your token refresh logic here
        // const response = await refreshTokenAPI(refreshToken);
        // this.setToken(response.access_token);
        return true;
      } catch {
        return false;
      }
    }

    return true;
  }
}

export const security = SecurityService.getInstance();
