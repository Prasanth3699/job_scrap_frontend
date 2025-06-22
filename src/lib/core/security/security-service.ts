// lib/core/security/security-service.ts
import { AES, enc } from "crypto-js";
import { jwtDecode } from "jwt-decode";
import { SecurityConfig, TokenPayload, SecurityHeaders } from "./types";
import { monitoring } from "../monitoring";

export class SecurityService {
  private static instance: SecurityService;
  private readonly config: SecurityConfig;

  private constructor() {
    this.config = {
      tokenKey: "token",
      encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY!,
      tokenExpiry: 30,
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
  setToken(token: string): void {
    try {
      localStorage.setItem(this.config.tokenKey, token);
      localStorage.setItem(
        `${this.config.tokenKey}_encrypted`,
        this.encrypt(token)
      );
    } catch (error) {
      console.error("Error storing token:", error);
      localStorage.setItem(this.config.tokenKey, token);
    }
  }

  getToken(): string | null {
    try {
      const encrypted = localStorage.getItem(
        `${this.config.tokenKey}_encrypted`
      );
      if (encrypted) {
        try {
          const decrypted = this.decrypt(encrypted);
          if (this.validateToken(decrypted)) return decrypted;
        } catch (e) {
          console.error("Error decrypting token:", e);
        }
      }

      const token = localStorage.getItem(this.config.tokenKey);
      if (token && this.validateToken(token)) return token;

      return null;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  }

  clearToken(): void {
    localStorage.removeItem(this.config.tokenKey);
    localStorage.removeItem(`${this.config.tokenKey}_encrypted`);
  }

  clearAllTokens(): void {
    this.clearToken();
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

  timeLeft(token: string): number {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp * 1000 - Date.now(); // ms until expiry
    } catch {
      return 0;
    }
  }

  getTokenPayload(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  hasPermission(requiredRole: "admin" | "user"): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.getTokenPayload(token);
      if (!payload) return false;

      // Check if user has admin privileges
      const isAdmin = payload.is_admin === true;

      // Admins have all permissions
      if (isAdmin) return true;

      // For regular users, check if the required role matches
      return requiredRole === "user";
    } catch {
      return false;
    }
  }

  sanitizeInput(input: string): string {
    if (typeof input !== "string") {
      return "";
    }

    // Remove potentially malicious content
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/g, "")
      .replace(/on\w+='[^']*'/g, "")
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "")
      .replace(/vbscript:/gi, "");

    // Trim and limit length
    sanitized = sanitized.trim().substring(0, 1000);

    // Validate against common attack patterns
    const attackPatterns = [
      /SELECT.*FROM/i,
      /INSERT INTO/i,
      /UPDATE.*SET/i,
      /DELETE FROM/i,
      /DROP TABLE/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    for (const pattern of attackPatterns) {
      if (pattern.test(sanitized)) {
        monitoring.trackError({
          message: "Potential attack pattern detected",
          error: new Error("Potential attack pattern detected"),
          metadata: { input: sanitized },
        });
        return "";
      }
    }

    return sanitized;
  }

  sanitizeOutput(data: any): any {
    if (typeof data === "string") {
      // Basic XSS protection
      return data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    return data;
  }

  async validateCsrfToken(token: string): Promise<boolean> {
    const storedToken = localStorage.getItem("csrf_token");
    if (!storedToken) return false;

    try {
      const decrypted = this.decrypt(storedToken);
      return decrypted === token;
    } catch {
      return false;
    }
  }

  generateCsrfToken(): string {
    const token = crypto.randomUUID();
    localStorage.setItem("csrf_token", this.encrypt(token));
    return token;
  }

  // Enhanced token validation
  validateTokenStructure(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Validate JWT structure
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      return !!header.alg && !!payload.exp;
    } catch {
      return false;
    }
  }

  // Encryption
  public encrypt(data: string): string {
    return AES.encrypt(data, this.config.encryptionKey).toString();
  }

  public decrypt(encrypted: string): string {
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

    // refresh when < 60 sec remain
    if (this.timeLeft(token) > 60_000) return true;

    try {
      // dynamic import here to avoid a cyclic-dependency at build time
      const { authApi } = await import("@/lib/api/auth-api");

      const { access_token } = await authApi.refreshToken();
      if (access_token) {
        this.setToken(access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearAllTokens();
      return false;
    }
  }
}

export const security = SecurityService.getInstance();
