export const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
};

export function withSecurityHeaders<T extends Response>(response: T): T {
  Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}
