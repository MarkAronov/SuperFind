import type { Context } from "hono";
import { Hono } from "hono";
import { handleSearchRequest } from "./ai.services";

const AIRouter = new Hono();

// Note: AI service is initialized in the main app startup sequence

// Get route for searching and getting AI answers
AIRouter.get("/search", async (c: Context) => {
	const query = c.req.query("query");
	const limit = Number.parseInt(c.req.query("limit") || "5", 10);
	const offset = Number.parseInt(c.req.query("offset") || "0", 10);

	// Validate pagination parameters
	const validLimit = Math.min(Math.max(limit, 1), 50); // Between 1 and 50
	const validOffset = Math.max(offset, 0); // >= 0

	const result = await handleSearchRequest(
		query || "",
		validLimit,
		validOffset,
	);

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
		pagination: result.pagination,
		timestamp: result.timestamp,
	});
});

export default AIRouter;
