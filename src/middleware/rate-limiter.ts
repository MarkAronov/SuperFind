import type { Context } from "hono";
import { rateLimiter } from "hono-rate-limiter";

/**
 * Extract user identifier from request
 * Priority: Authorization header > X-User-ID header > IP address
 */
const keyGenerator = (c: Context): string => {
	// Check for user ID in authorization (e.g., JWT subject or API key)
	const authHeader = c.req.header("Authorization");
	if (authHeader) {
		return `auth:${authHeader}`;
	}

	// Check for explicit user ID header
	const userId = c.req.header("X-User-ID");
	if (userId) {
		return `user:${userId}`;
	}

	// Fall back to IP address
	const forwarded = c.req.header("X-Forwarded-For");
	const ip = forwarded?.split(",")[0]?.trim() || "unknown";
	return `ip:${ip}`;
};

/**
 * Rate limiter for AI endpoints (stricter limits)
 * 30 requests per minute
 */
export const aiRateLimiter = rateLimiter({
	windowMs: 60 * 1000, // 1 minute
	limit: 30,
	standardHeaders: "draft-6",
	keyGenerator,
	message: {
		error: "rate_limit_exceeded",
		message: "AI search rate limit exceeded. Please wait before trying again.",
	},
});

/**
 * General API rate limiter
 * 100 requests per minute
 */
export const generalRateLimiter = rateLimiter({
	windowMs: 60 * 1000, // 1 minute
	limit: 100,
	standardHeaders: "draft-6",
	keyGenerator,
	message: {
		error: "rate_limit_exceeded",
		message: "Too many requests, please try again later.",
	},
});

/**
 * Strict rate limiter for sensitive operations
 * 10 requests per minute
 */
export const strictRateLimiter = rateLimiter({
	windowMs: 60 * 1000, // 1 minute
	limit: 10,
	standardHeaders: "draft-6",
	keyGenerator,
	message: {
		error: "rate_limit_exceeded",
		message: "Too many attempts. Please wait before trying again.",
	},
});
