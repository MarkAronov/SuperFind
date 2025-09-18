import type { Context } from "hono";
import { Hono } from "hono";
import { handleSearchRequest, initializeAI } from "./ai.services";

const AIRouter = new Hono();

// Initialize AI service on module load
initializeAI();

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

export default AIRouter;
