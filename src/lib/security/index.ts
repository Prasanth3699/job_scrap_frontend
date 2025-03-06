import { AES, enc } from "crypto-js";
import { jwtDecode } from "jwt-decode";

interface SecurityConfig {
  encryptionKey: string;
  tokenKey: string;
}

export class SecurityService {
  private static instance: SecurityService;
  private config: SecurityConfig;

  private constructor() {
    this.config = {
      encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY!,
      tokenKey: "auth_token",
    };
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Secure token storage
  setToken(token: string): void {
    const encrypted = this.encrypt(token);
    localStorage.setItem(this.config.tokenKey, encrypted);
  }

  getToken(): string | null {
    const encrypted = localStorage.getItem(this.config.tokenKey);
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  }

  // Token validation
  validateToken(token: string): boolean {
    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp;
      if (!exp) return false;
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  // Data encryption/decryption
  encrypt(data: string): string {
    return AES.encrypt(data, this.config.encryptionKey).toString();
  }

  decrypt(encrypted: string): string {
    return AES.decrypt(encrypted, this.config.encryptionKey).toString(enc.Utf8);
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      "Content-Security-Policy": "default-src 'self'",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    };
  }
}

export const security = SecurityService.getInstance();
