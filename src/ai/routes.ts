import type { Context } from "hono";
import { Hono } from "hono";
import { getAllDocuments } from "../database";
import { aiRateLimiter } from "../middleware/rate-limiter";
import { handleSearchRequest } from "./index";

const AIRouter = new Hono();

// Apply rate limiting to all AI routes
AIRouter.use("/*", aiRateLimiter);

// Note: AI service is initialized in the main app startup sequence

// Get route for searching and getting AI answers
AIRouter.get("/search", async (c: Context) => {
	const query = c.req.query("query");
	const result = await handleSearchRequest(query || "");

	if (!result.success) {
		return c.json(
			{
				error: result.error,
				details: result.details,
			},
			result.error === "Query parameter is required" ? 400 : 500,
		);
	}

	return c.json({
		success: result.success,
		query: result.query,
		answer: result.answer,
		sources: result.sources,
		timestamp: result.timestamp,
	});
});

// Get route for retrieving all people from the database
AIRouter.get("/people", async (c: Context) => {
	const limitParam = c.req.query("limit");
	const limit = limitParam ? Number.parseInt(limitParam, 10) : 100;

	const result = await getAllDocuments("people", limit);

	if (!result.success) {
		return c.json(
			{
				error: result.error,
			},
			500,
		);
	}

	return c.json({
		success: true,
		count: (result.data as unknown[]).length,
		people: result.data,
	});
});

export default AIRouter;
