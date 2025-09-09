import type { Context } from "hono";
import { Hono } from "hono";

// TODO: Fix these imports once database and service classes are implemented
// import { JsonFileHashDatabase } from "../utils/json-database";
// import { PersistentAIService } from "./ai-service";

const AIRouter = new Hono();

// TODO: Initialize AI service once classes are implemented
// const database = new JsonFileHashDatabase();
// const aiService = new PersistentAIService(database);

// GET route for searching and getting AI answers
AIRouter.get("/search", async (c: Context) => {
	try {
		const query = c.req.query("query");

		if (!query) {
			return c.json(
				{
					error: "Query parameter is required",
				},
				400,
			);
		}

		console.log(`🔍 AI Search request: ${query}`);

		// TODO: Implement AI service calls once service is ready
		// const answer = await aiService.getAnswer(query);
		// const searchResults = await aiService.searchContent(query, 5);

		return c.json({
			success: true,
			query,
			answer: "AI service is being implemented",
			sources: [],
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("AI search error:", error);
		return c.json(
			{
				error: "Failed to process search request",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			500,
		);
	}
});

export default AIRouter;
