import { ChatPromptTemplate } from "@langchain/core/prompts";
import { hybridSearch } from "../database";
import { parsePersonFromContent } from "../parser/person-extractor";
import {
	createZodSchemaFromKeys,
	extractKeysFromInterface,
	parseAndValidateJson,
} from "../utils/interface-parser";
import { log } from "../utils/logger";
import type { AIProvider, SearchResult, TextToJsonResult } from "./types";

/**
 * Main AI Service - handles the 2 core tasks using LangChain:
 * 1. Text to JSON conversion (with interface-driven keys)
 * 2. Database search with AI-powered answers
 */

// Service state
let provider: AIProvider;

/**
 * Initialize the AI service with provider and vector store
 */
export const initializeAIService = (aiProvider: AIProvider): void => {
	provider = aiProvider;
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

CRITICAL INSTRUCTIONS:
- Return ONLY a valid JSON object - no markdown, no explanations, no code blocks
- Use the exact key names provided: {keys}
- If a key's value is not found in the text, use an empty string ""
- Ensure all required keys are present
- Do NOT wrap the JSON in \`\`\`json or \`\`\` markers
- The response must start with {{ and end with }}

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
 * TASK 2: Search database and generate AI-powered answer using hybrid search
 * Extracts filters from natural language query and uses Qdrant native filtering
 * @param query - User search query
 * @param limit - Max number of sources to retrieve
 */
export const searchAndAnswer = async (
	query: string,
	limit = 10,
	offset = 0,
): Promise<SearchResult> => {
	try {
		// Extract filter criteria from the query using AI
		const filters = await extractFiltersFromQuery(query);

		log(
			"AI_EXTRACTED_FILTERS",
			{
				query,
				filters: JSON.stringify(filters),
			},
			2,
		);

		// Use hybrid search (vector + keyword/BM25 + metadata filtering)
		// Fetch extra results to determine if there are more pages
		// We fetch limit + offset + 1 to check if hasMore without fetching all results
		const fetchLimit = limit + offset + 1;
		const searchResult = await hybridSearch(query, filters, fetchLimit);

		if (!searchResult.success || !searchResult.data) {
			throw new Error(searchResult.error || "Hybrid search failed");
		}

		const allResults = searchResult.data;

		// Apply offset and limit
		const results = allResults.slice(offset, offset + limit);
		if (results.length === 0 && offset === 0) {
			return {
				success: true,
				answer: "I couldn't find any people matching your criteria.",
				sources: [],
				total: 0,
				hasMore: false,
			};
		}

		log("AI_CANDIDATES_RETRIEVED", { count: results.length.toString() }, 2);

		// Convert to search sources format
		const allSources = results.map((result, index) => ({
			id: `doc-${index}`,
			content: result.content,
			metadata: { ...result.metadata, score: result.score },
			relevanceScore: result.score,
		}));

		// Generate AI summary of results
		const summary = await generateSearchSummary(query, allSources);

		return {
			success: true,
			answer: summary,
			sources: allSources,
			total: allResults.length,
			hasMore: allResults.length > offset + limit,
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
 * Extract filter criteria from natural language query using AI
 */
const extractFiltersFromQuery = async (
	query: string,
): Promise<{
	location?: string;
	skills?: string;
	role?: string;
	minExperience?: number;
	maxExperience?: number;
}> => {
	try {
		const prompt = ChatPromptTemplate.fromTemplate(`
Extract search filters from this query. Return a JSON object with these optional fields:
- location: city or country mentioned (e.g., "Italy", "New York")
- skills: specific skills mentioned as a single STRING (e.g., "Python", "React JavaScript", "Docker Kubernetes")
- role: job title mentioned (e.g., "Developer", "Manager")
- minExperience: minimum years of experience (number)
- maxExperience: maximum years of experience (number)

Query: "{query}"

Rules:
- Only include fields that are explicitly mentioned in the query
- For experience like "5+ years", set minExperience to 5
- For experience like "less than 3 years", set maxExperience to 3
- For skills, if multiple skills are mentioned, join them with spaces into a SINGLE STRING
- Return ONLY valid JSON, no markdown, no explanations
- If no filters are found, return {{}}

JSON Response:`);

		const formattedPrompt = await prompt.format({ query });
		const response = await provider.generateCompletion(formattedPrompt, {
			temperature: 0.1,
			maxTokens: 200,
		});

		const cleanResponse = response
			.trim()
			.replace(/^```json\s*/i, "")
			.replace(/^```\s*/i, "")
			.replace(/\s*```$/i, "")
			.trim();

		const filters = JSON.parse(cleanResponse) as {
			location?: string;
			skills?: string;
			role?: string;
			minExperience?: number;
			maxExperience?: number;
		};

		return filters;
	} catch (error) {
		log("AI_FILTER_EXTRACTION_ERROR", { error: String(error) }, 2);
		return {}; // Return empty filters on error
	}
};

/**
 * Generate a summary of search results using AI
 */
const generateSearchSummary = async (
	query: string,
	sources: Array<{
		id: string;
		content: string;
		metadata: Record<string, unknown>;
		relevanceScore: number;
	}>,
): Promise<string> => {
	if (sources.length === 0) {
		return "No candidates found.";
	}

	try {
		const prompt = ChatPromptTemplate.fromTemplate(`
You are a search assistant. Provide a brief summary of the search results.

Query: "{query}"

Results ({count} people found):
{results}

Generate a concise 1-2 sentence summary highlighting:
- How many people were found
- Key qualifications or roles
- Locations if relevant

Summary:`);

		const resultsText = sources
			.slice(0, 10) // Only summarize top 10
			.map((s, idx) => `${idx + 1}. ${s.content.substring(0, 200)}`)
			.join("\n");

		const formattedPrompt = await prompt.format({
			query,
			count: sources.length.toString(),
			results: resultsText,
		});

		const response = await provider.generateCompletion(formattedPrompt, {
			temperature: 0.2,
			maxTokens: 300,
		});

		return response.trim();
	} catch (error) {
		log("AI_SUMMARY_ERROR", { error: String(error) }, 2);
		return `Found ${sources.length} people matching your search.`;
	}
};

/**
 * Parse person data from search source, preferring structured metadata
 * @param source - Search result source with content and metadata
 * @returns Structured person data object
 */
const parsePersonFromSource = (source: {
	content: string;
	metadata: Record<string, unknown>;
}): Record<string, unknown> => {
	const metadata = source.metadata || {};

	// Check if we have structured data in metadata (data_* fields from Qdrant)
	const hasStructuredData = metadata.data_name || metadata.data_email;

	if (hasStructuredData) {
		// Use structured data from Qdrant payload
		return {
			name: metadata.data_name || "Unknown",
			location: metadata.data_location || "Unknown",
			role: metadata.data_role || "Unknown",
			skills: metadata.data_skills || "Unknown",
			experience:
				metadata.data_experience || metadata.data_experience_years || 0,
			experience_years:
				metadata.data_experience_years || metadata.data_experience || 0,
			description: metadata.data_description || "",
			email: metadata.data_email || "",
			relevanceScore: metadata.score || 0.8,
			rawContent: source.content,
		};
	}

	// Fallback: parse from content string
	const personData = parsePersonFromContent(source.content);
	return {
		...personData,
		relevanceScore: metadata.score || 0.8,
		rawContent: source.content,
	};
};

/**
 * Handle search requests and return AI-powered answers with structured person data
 */
export const handleSearchRequest = async (
	query: string,
	limit = 20,
	offset = 0,
): Promise<{
	success: boolean;
	query: string;
	answer?: string;
	people?: Array<Record<string, unknown>>;
	sources?: Array<{ content: string; metadata: Record<string, unknown> }>;
	total?: number;
	limit?: number;
	offset?: number;
	hasMore?: boolean;
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

		log(
			"AI_SEARCH_REQUEST",
			{ query, limit: limit.toString(), offset: offset.toString() },
			2,
		);

		// Use the AI service with AI-powered filtering
		const result = await searchAndAnswer(query, limit, offset);

		if (!result.success) {
			return {
				success: false,
				query,
				error: "Failed to process search request",
				details: result.error || "Unknown error",
				timestamp: new Date().toISOString(),
			};
		}

		log("AI_SEARCH_RESULTS", { count: result.sources.length.toString() }, 2);

		// Parse person data from each source using helper function
		const people = result.sources.map(parsePersonFromSource);

		return {
			success: true,
			query,
			answer: result.answer,
			people, // Structured person objects
			sources: result.sources, // Keep original sources for backwards compatibility
			total: result.total,
			limit,
			offset,
			hasMore: result.hasMore,
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		log("AI_SEARCH_ERROR", { error: String(error) }, 2);
		return {
			success: false,
			query,
			error: "Failed to process search request",
			details: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};
	}
};
