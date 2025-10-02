import type { Context } from "hono";
import { Hono } from "hono";
import { handleSearchRequest, initializeAI } from "./ai.services";

const AIRouter = new Hono();

// Initialize AI service on module load
initializeAI();

// Get route for searching and getting AI answers
AIRouter.get("/search", async (c: Context) => {
	const query = c.req.query("query");
	
	// Parse pagination parameters with validation
	const limitParam = c.req.query("limit");
	const offsetParam = c.req.query("offset");
	
	const limit = limitParam ? Number.parseInt(limitParam, 10) : 5;
	const offset = offsetParam ? Number.parseInt(offsetParam, 10) : 0;
	
	// Validate pagination parameters
	if (Number.isNaN(limit) || limit < 1 || limit > 50) {
		return c.json(
			{
				error: "Invalid limit parameter",
				details: "Limit must be a number between 1 and 50",
			},
			400,
		);
	}
	
	if (Number.isNaN(offset) || offset < 0) {
		return c.json(
			{
				error: "Invalid offset parameter",
				details: "Offset must be a non-negative number",
			},
			400,
		);
	}
	
	const result = await handleSearchRequest(query || "", limit, offset);

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
