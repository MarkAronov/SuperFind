import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import {
	createLangChainVectorStore,
	initQdrant,
} from "../vector/qdrant.services";
import type {
	AIProvider,
	SearchResult,
	TextToJsonResult,
	VectorStore,
} from "./ai.interface";
import { createProvider, getPresets } from "./providers/provider-factory";

/**
 * Main AI Service - handles the 2 core tasks using LangChain:
 * 1. Text to JSON conversion (with interface-driven keys)
 * 2. Database search with AI-powered answers
 */

// Service state
let provider: AIProvider;
let vectorStore: VectorStore | undefined;

/**
 * Initialize the AI service with provider and vector store
 */
export const initializeAIService = (
	aiProvider: AIProvider,
	aiVectorStore?: VectorStore,
): void => {
	provider = aiProvider;
	vectorStore = aiVectorStore;
};

/**
 * TASK 1: Convert text to JSON using TypeScript interface keys with LangChain structured output
 * @param text - Raw text to convert
 * @param targetInterface - TypeScript interface string
 * @param hint - Optional extraction hint (e.g., "people", "contacts")
 */
export const convertTextToJson = async (
	text: string,
	targetInterface: string,
	hint?: string,
): Promise<TextToJsonResult> => {
	try {
		// Parse interface to get expected keys
		const interfaceKeys = extractKeysFromInterface(targetInterface);

		// Create dynamic Zod schema for validation
		const zodSchema = createZodSchemaFromKeys(interfaceKeys);

		// Create LangChain prompt template for structured output
		const prompt = ChatPromptTemplate.fromTemplate(`
Extract information from the following text and return a valid JSON object with these exact keys: {keys}
{hint}

Text to analyze:
{text}

Instructions:
- Return ONLY a valid JSON object, no explanations
- Use the exact key names provided: {keys}
- If a key's value is not found, use empty string ""
- Ensure all required keys are present

JSON Response:`);

		const formattedPrompt = await prompt.format({
			keys: interfaceKeys.join(", "),
			hint: hint ? `Focus on extracting: ${hint}` : "",
			text: text,
		});

		// Use the language model to generate completion
		const response = await provider.generateCompletion(formattedPrompt, {
			temperature: 0.1, // Low temp for structured output
			maxTokens: 1000,
		});

		// Parse and validate JSON response
		const jsonData = parseAndValidateJson(response, zodSchema, interfaceKeys);

		return {
			success: true,
			data: jsonData,
		};
	} catch (error) {
		return {
			success: false,
			data: {},
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

/**
 * TASK 2: Search database and generate AI-powered answer using LangChain templates
 * @param query - User search query
 * @param limit - Max number of sources to retrieve
 */
export const searchAndAnswer = async (
	query: string,
	limit = 5,
): Promise<SearchResult> => {
	try {
		if (!vectorStore) {
			throw new Error("Vector store not configured");
		}

		// Retrieve relevant documents using LangChain vector store
		const documents = await vectorStore.similaritySearch(query, limit);

		if (documents.length === 0) {
			return {
				success: true,
				answer: "I couldn't find any relevant information for your query.",
				sources: [],
			};
		}

		// Convert documents to search sources format
		const sources = documents.map((doc, index) => ({
			id: doc.metadata?.id || `doc-${index}`,
			content: doc.pageContent,
			metadata: doc.metadata || {},
			relevanceScore: doc.metadata?.score || 0.8,
		}));

		// Create LangChain prompt template for answer generation
		const answerPrompt = ChatPromptTemplate.fromTemplate(`
Answer the following question based ONLY on the provided context. If the context doesn't contain enough information, say so clearly.

Question: {query}

Context:
{context}

Instructions:
- Provide a clear, concise answer
- Only use information from the context provided
- If you're unsure about any information, mention the uncertainty
- Cite specific sources when possible using phrases like "According to Source 1..." 
- If the context is insufficient, state that clearly

Answer:`);

		const context = sources
			.map((source, index) => `Source ${index + 1}: ${source.content}`)
			.join("\n\n");

		const formattedPrompt = await answerPrompt.format({
			query,
			context,
		});

		// Generate AI-powered answer
		const answer = await provider.generateCompletion(formattedPrompt, {
			temperature: 0.3,
			maxTokens: 500,
		});

		return {
			success: true,
			answer: answer.trim(),
			sources,
		};
	} catch (error) {
		return {
			success: false,
			answer: "",
			sources: [],
			error: error instanceof Error ? error.message : "Search failed",
		};
	}
};

/**
 * Helper: Extract property keys from TypeScript interface
 */
const extractKeysFromInterface = (interfaceString: string): string[] => {
	const propertyRegex = /(\w+)(?:\?)?\s*:/g;
	const keys: string[] = [];
	let match: RegExpExecArray | null;

	while (true) {
		match = propertyRegex.exec(interfaceString);
		if (match === null) break;
		keys.push(match[1]);
	}

	return keys;
};

/**
 * Helper: Create Zod schema from interface keys for validation
 */
const createZodSchemaFromKeys = (keys: string[]) => {
	const schemaObject: Record<string, z.ZodTypeAny> = {};
	for (const key of keys) {
		schemaObject[key] = z.string().optional().default("");
	}
	return z.object(schemaObject);
};

/**
 * Helper: Parse and validate JSON response using Zod
 */
const parseAndValidateJson = (
	response: string,
	schema: z.ZodSchema,
	expectedKeys: string[],
): Record<string, unknown> => {
	try {
		// Try to extract JSON from response
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			throw new Error("No JSON found in response");
		}

		const parsed = JSON.parse(jsonMatch[0]);

		// Validate using Zod schema
		const validated = schema.parse(parsed) as Record<string, unknown>;

		// Ensure all expected keys exist
		const result: Record<string, unknown> = {};
		for (const key of expectedKeys) {
			result[key] = validated[key] || "";
		}

		return result;
	} catch (error) {
		console.warn("        ⚠ JSON parsing/validation failed:");
		if (error instanceof z.ZodError) {
			console.warn("          Schema validation errors:");
			for (const issue of error.issues) {
				console.warn(`          - ${issue.path.join(".")}: ${issue.message}`);
			}
		} else {
			console.warn(
				`          ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}

		// Fallback: create empty object with expected keys
		const fallback: Record<string, unknown> = {};
		for (const key of expectedKeys) {
			fallback[key] = "";
		}
		return fallback;
	}
};

/**
 * Initialize AI service with LangChain providers and vector store
 */
export const initializeAI = async (): Promise<void> => {
	try {
		// Initialize Qdrant connection first
		await initQdrant();

		// Create AI provider (fallback to Ollama if OpenAI not available)
		const preset = process.env.OPENAI_API_KEY ?? "gpt5-mini";
		const config = getPresets()[preset] || {
			type: "ollama" as const,
			model: "llama3.2:latest",
			name: "Llama 3.2",
		};

		const provider = createProvider(config);
		const vectorStore = await createLangChainVectorStore();

		// Initialize AI service with LangChain components
		initializeAIService(provider, vectorStore);

		console.log(
			"        ✓ AI service initialized successfully with LangChain ",
		);
	} catch (error) {
		console.error("        ✗ Failed to initialize AI service:", error);
	}
};

/**
 * Handle search requests and return AI-powered answers
 */
export const handleSearchRequest = async (
	query: string,
): Promise<{
	success: boolean;
	query: string;
	answer?: string;
	sources?: Array<{ content: string; metadata: Record<string, unknown> }>;
	timestamp: string;
	error?: string;
	details?: string;
}> => {
	try {
		if (!query) {
			return {
				success: false,
				query: "",
				error: "Query parameter is required",
				timestamp: new Date().toISOString(),
			};
		}

		console.log(`        → AI Search request: ${query}`);

		// Use the AI service to search and generate an answer
		const result = await searchAndAnswer(query, 5);

		if (!result.success) {
			return {
				success: false,
				query,
				error: "Failed to process search request",
				details: result.error || "Unknown error",
				timestamp: new Date().toISOString(),
			};
		}

		return {
			success: true,
			query,
			answer: result.answer,
			sources: result.sources,
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		console.error("        ✗ AI search error:", error);
		return {
			success: false,
			query,
			error: "Failed to process search request",
			details: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};
	}
};
