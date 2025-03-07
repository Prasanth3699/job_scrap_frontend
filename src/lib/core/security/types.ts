export interface SecurityConfig {
  tokenKey: string;
  refreshTokenKey: string;
  encryptionKey: string;
  tokenExpiry: number; // in minutes
  refreshTokenExpiry: number; // in days
}

export interface TokenPayload {
  sub: string;
  exp: number;
  iat: number;
  is_admin: boolean;
  email?: string;
}

export interface SecurityHeaders {
  "Content-Security-Policy": string;
  "X-Frame-Options": string;
  "X-Content-Type-Options": string;
  "Referrer-Policy": string;
  "Permissions-Policy": string;
  "Strict-Transport-Security": string;
  "X-XSS-Protection": string;
}
