/**
 * Web Security 2026 - Enterprise grade security utilities
 * Implements CSP, rate limiting, input sanitization, CSRF protection
 */

import type { NextRequest, NextResponse } from "next/server"

// Rate limiting storage (in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(req: NextRequest, maxRequests = 5, windowMs = 1000): boolean {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
  const now = Date.now()

  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken
}

export const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
}

export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
