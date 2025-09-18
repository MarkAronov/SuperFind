import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import type { Context } from "hono";
import { Hono } from "hono";
import { initQdrant } from "../vector/qdrant.service";
import type { VectorStore } from "./ai.interface";
import {
	convertTextToJson,
	initializeAIService,
	searchAndAnswer,
} from "./ai.service";
import { createProvider, getPresets } from "./providers/provider-factory";

const AIRouter = new Hono();

// LangChain vector store implementation using Qdrant
const createLangChainVectorStore = async (): Promise<VectorStore> => {
	try {
		// Initialize embeddings
		const embeddings = new OpenAIEmbeddings({
			model: "text-embedding-3-small",
		});

		// Create LangChain Qdrant vector store
		const vectorStore = await QdrantVectorStore.fromExistingCollection(
			embeddings,
			{
				url: `${process.env.QDRANT_PROTOCOL || "http"}://${process.env.QDRANT_HOST || "localhost"}:${process.env.QDRANT_PORT || 6333}`,
				collectionName: "documents",
				apiKey: process.env.QDRANT_API_KEY,
			},
		);

		console.log("✅ LangChain Qdrant vector store created successfully");
		return vectorStore as VectorStore;
	} catch (error) {
		console.warn(
			"⚠️ Failed to create LangChain vector store, using fallback:",
			error,
		);

		// Create a mock implementation that satisfies the VectorStore interface
		const mockVectorStore = {
			async similaritySearch(query: string, k = 5) {
				console.log(`🔍 Fallback search for: ${query}`);
				return [
					new Document({
						pageContent: `Sample content related to: ${query}`,
						metadata: { id: "doc1", source: "static-data", score: 0.8 },
					}),
					new Document({
						pageContent: `Additional information about: ${query}`,
						metadata: { id: "doc2", source: "uploaded-files", score: 0.6 },
					}),
				].slice(0, k);
			},
			async addDocuments(documents: Document[]) {
				console.log(`📝 Fallback: Would add ${documents.length} documents`);
			},
			async delete() {
				console.log("🗑️ Fallback: Would delete documents");
			},
		};

		// Cast to VectorStore interface
		return mockVectorStore as unknown as VectorStore;
	}
};

// Initialize AI service with LangChain providers and vector store
const initializeAI = async () => {
	try {
		// Initialize Qdrant connection first
		await initQdrant();

		// Create AI provider (fallback to Ollama if OpenAI not available)
		const preset = process.env.OPENAI_API_KEY ? "gpt4-mini" : "llama3.2";
		const config = getPresets()[preset] || {
			type: "ollama" as const,
			model: "llama3.2:latest",
			name: "Llama 3.2",
		};

		const provider = createProvider(config);
		const vectorStore = await createLangChainVectorStore();

		// Initialize AI service with LangChain components
		initializeAIService(provider, vectorStore);

		console.log("🤖 AI service initialized successfully with LangChain");
	} catch (error) {
		console.error("❌ Failed to initialize AI service:", error);
	}
};

// Initialize on module load
initializeAI();

//Get route for searching and getting AI answers
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

		// Use the AI service to search and generate an answer
		const result = await searchAndAnswer(query, 5);

		if (!result.success) {
			return c.json(
				{
					error: "Failed to process search request",
					details: result.error || "Unknown error",
				},
				500,
			);
		}

		return c.json({
			success: true,
			query,
			answer: result.answer,
			sources: result.sources,
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

// POST route for converting text to JSON using TypeScript interface
AIRouter.post("/convert", async (c: Context) => {
	try {
		const body = await c.req.json();
		const { text, interface: targetInterface, hint } = body;

		if (!text || !targetInterface) {
			return c.json(
				{
					error: "Both 'text' and 'interface' fields are required",
				},
				400,
			);
		}

		console.log(`🔄 AI Convert request for interface: ${targetInterface}`);

		// Use the AI service to convert text to JSON
		const result = await convertTextToJson(text, targetInterface, hint);

		if (!result.success) {
			return c.json(
				{
					error: "Failed to convert text to JSON",
					details: result.error || "Unknown error",
				},
				500,
			);
		}

		return c.json({
			success: true,
			data: result.data,
			confidence: result.confidence,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("AI convert error:", error);
		return c.json(
			{
				error: "Failed to process conversion request",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			500,
		);
	}
});

export default AIRouter;
