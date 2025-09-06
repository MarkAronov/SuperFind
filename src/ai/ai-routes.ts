import type { Context } from "hono";
import { Hono } from "hono";
import { JsonFileHashDatabase } from "../services/json-database.js";
import { PersistentAIService } from "../services/persistent-ai.service.js";

const AIRouter = new Hono();

// Initialize AI service
const database = new JsonFileHashDatabase();
const aiService = new PersistentAIService(database);

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

		// Get AI-powered answer
		const answer = await aiService.getAnswer(query);
		const searchResults = await aiService.searchContent(query, 5);

		return c.json({
			success: true,
			query,
			answer,
			sources: searchResults,
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
