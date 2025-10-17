import type { Document as LangChainDocument } from "@langchain/core/documents";
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
 * TASK 2: Search database and generate AI-powered answer using LangChain templates
 * @param query - User search query
 * @param limit - Max number of sources to retrieve
 */
export const searchAndAnswer = async (
	query: string,
	limit = 20,
): Promise<SearchResult> => {
	try {
		if (!vectorStore) {
			throw new Error("Vector store not configured");
		}

		// Retrieve relevant documents
		const documentsWithScores = await vectorStore.similaritySearchWithScore(
			query,
			limit,
		);

		if (documentsWithScores.length === 0) {
			return {
				success: true,
				answer: "I couldn't find any people matching your criteria.",
				sources: [],
			};
		}

		console.log(`        → Retrieved ${documentsWithScores.length} candidates`);

		// Log first score to understand the scoring format
		if (documentsWithScores.length > 0) {
			const firstScore = documentsWithScores[0][1];
			console.log(`        → Sample score: ${firstScore} (raw from Qdrant)`);
		}

		// Convert documents to search sources format
		// Qdrant with Cosine distance returns similarity scores (higher = more similar)
		// Scores should be between 0 and 1, but let's normalize them properly
		const allSources = documentsWithScores.map(([doc, score], index) => {
			// Convert score to percentage (0-1 range)
			// If using cosine similarity, score is already 0-1 where 1 = perfect match
			// If score is negative or >1, it indicates distance metric - convert it
			let normalizedScore = score;

			// Handle different score formats
			if (score < 0 || score > 1) {
				// If score is outside 0-1, assume it's a distance metric
				// For cosine distance: convert to similarity (1 - distance/2)
				normalizedScore = Math.max(0, 1 - Math.abs(score) / 2);
			}

			// Clamp to 0-1 range
			normalizedScore = Math.max(0, Math.min(1, normalizedScore));

			return {
				id: `doc-${index}`,
				content: doc.pageContent,
				metadata: { ...doc.metadata, score: normalizedScore },
				relevanceScore: normalizedScore,
			};
		});

		// Single AI call: Filter AND generate answer
		const result = await filterAndAnswerWithAI(query, allSources);

		return {
			success: true,
			answer: result.answer,
			sources: result.filteredSources,
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
 * Single AI call: Filter candidates AND generate answer
 */
const filterAndAnswerWithAI = async (
	query: string,
	sources: Array<{
		id: string;
		content: string;
		metadata: Record<string, unknown>;
		relevanceScore: number;
	}>,
): Promise<{
	answer: string;
	filteredSources: Array<{
		id: string;
		content: string;
		metadata: Record<string, unknown>;
		relevanceScore: number;
	}>;
}> => {
	if (sources.length === 0) {
		return { answer: "No candidates found.", filteredSources: [] };
	}

	try {
		const prompt = ChatPromptTemplate.fromTemplate(`
You are a search assistant. Analyze the query and candidates, then:
1. Identify which candidates match ALL criteria in the query
2. Provide a brief summary of the matching people

Query: "{query}"

Candidates:
{candidates}

Instructions:
- If query mentions location (e.g., "from Italy"), only include people from that location
- If query mentions skills (e.g., "Python"), only include people with those skills
- If query mentions experience (e.g., "5+ years"), only include people meeting that requirement
- Return a JSON object with:
  - "matchingIndices": array of numbers (e.g., [0, 2, 5]) of candidates who match ALL criteria
  - "summary": brief text summary of the matching people

Response format:
{{"matchingIndices": [0, 1], "summary": "Found 2 Python developers from Italy..."}}

Response:`);

		const candidatesText = sources
			.map((s, idx) => `[${idx}] ${s.content.substring(0, 300)}`)
			.join("\n\n");

		const formattedPrompt = await prompt.format({
			query,
			candidates: candidatesText,
		});

		const response = await provider.generateCompletion(formattedPrompt, {
			temperature: 0.2,
			maxTokens: 300,
		});

		// Parse response
		const cleanResponse = response
			.trim()
			.replace(/^```json\s*/i, "")
			.replace(/^```\s*/i, "")
			.replace(/\s*```$/i, "")
			.trim();

		const parsed = JSON.parse(cleanResponse) as {
			matchingIndices: number[];
			summary: string;
		};

		// Filter sources by matching indices
		const filteredSources = parsed.matchingIndices
			.filter((idx) => idx >= 0 && idx < sources.length)
			.map((idx) => sources[idx]);

		console.log(
			`        → AI filtered ${sources.length} → ${filteredSources.length} results`,
		);

		// Return all sources if AI found nothing (fallback)
		if (filteredSources.length === 0) {
			return {
				answer: parsed.summary || "No exact matches found.",
				filteredSources: sources,
			};
		}

		return {
			answer: parsed.summary,
			filteredSources,
		};
	} catch (error) {
		console.warn(`        ⚠ AI filtering error:`, error);
		return {
			answer: "Found several candidates matching your search.",
			filteredSources: sources, // Fallback: return all
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
 * Helper: Parse and validate JSON response using Zod with improved error handling
 */
const parseAndValidateJson = (
	response: string,
	schema: z.ZodSchema,
	expectedKeys: string[],
): Record<string, unknown> => {
	try {
		// Clean the response - remove markdown code blocks if present
		let cleanedResponse = response.trim();
		cleanedResponse = cleanedResponse.replace(/^```json\s*/i, "");
		cleanedResponse = cleanedResponse.replace(/^```\s*/i, "");
		cleanedResponse = cleanedResponse.replace(/\s*```$/i, "");
		cleanedResponse = cleanedResponse.trim();

		// Try to extract JSON from response - support both object and array
		const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			throw new Error(
				`No JSON object found in response. Response preview: ${cleanedResponse.substring(0, 100)}...`,
			);
		}

		// Parse JSON
		let parsed: unknown;
		try {
			parsed = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			throw new Error(
				`JSON syntax error: ${parseError instanceof Error ? parseError.message : "Invalid JSON"}. Content: ${jsonMatch[0].substring(0, 100)}...`,
			);
		}

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
		console.warn(
			"          Using fallback data with empty values for all keys",
		);

		// Fallback: create empty object with expected keys
		const fallback: Record<string, unknown> = {};
		for (const key of expectedKeys) {
			fallback[key] = "";
		}
		return fallback;
	}
};

/**
 * Helper: Parse person data from content string
 */
const parsePersonFromContent = (content: string): Record<string, unknown> => {
	const person: Record<string, unknown> = {
		name: "",
		location: "",
		role: "",
		skills: "",
		experience_years: 0,
		email: "",
	};

	// Extract name (usually first line or "Name: value")
	const nameMatch =
		content.match(/^([A-Z][a-zA-Z\s.'-]+)(?:\s+is|\s+from|,)/i) ||
		content.match(/name[:\s]+([A-Z][a-zA-Z\s.'-]+)/i);
	if (nameMatch) person.name = nameMatch[1].trim();

	// Extract location
	const locationMatch =
		content.match(/location[:\s]+([^,\n]+)/i) ||
		content.match(/from\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|\s+is|\s+role)/i);
	if (locationMatch) person.location = locationMatch[1].trim();

	// Extract role
	const roleMatch =
		content.match(/role[:\s]+([^,\n]+)/i) ||
		content.match(/is\s+a[n]?\s+([A-Z][a-zA-Z\s]+?)(?:\.|,|\s+from|\s+with)/i);
	if (roleMatch) person.role = roleMatch[1].trim();

	// Extract skills
	const skillsMatch = content.match(/skills?[:\s]+([^,\n]+(?:;[^,\n]+)*)/i);
	if (skillsMatch) person.skills = skillsMatch[1].trim();

	// Extract experience years
	const expMatch =
		content.match(/experience[_\s]*years?[:\s]+(\d+)/i) ||
		content.match(/(\d+)\s+years?\s+(?:of\s+)?experience/i);
	if (expMatch) person.experience_years = Number.parseInt(expMatch[1], 10);

	// Extract email
	const emailMatch =
		content.match(
			/email[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
		) ||
		content.match(
			/contact[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
		) ||
		content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
	if (emailMatch) person.email = emailMatch[1].trim();

	return person;
};

/**
 * Handle search requests and return AI-powered answers with structured person data
 */
export const handleSearchRequest = async (
	query: string,
): Promise<{
	success: boolean;
	query: string;
	answer?: string;
	people?: Array<Record<string, unknown>>;
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

		// Use the AI service with AI-powered filtering
		const result = await searchAndAnswer(query, 20);

		if (!result.success) {
			return {
				success: false,
				query,
				error: "Failed to process search request",
				details: result.error || "Unknown error",
				timestamp: new Date().toISOString(),
			};
		}

		console.log(`        ✓ Found ${result.sources.length} relevant results`);

		// Parse person data from each source
		const people = result.sources.map((source) => {
			const personData = parsePersonFromContent(source.content);
			return {
				...personData,
				relevanceScore: source.metadata?.score || 0.8,
				rawContent: source.content, // Keep original for reference
			};
		});

		return {
			success: true,
			query,
			answer: result.answer,
			people, // Structured person objects
			sources: result.sources, // Keep original sources for backwards compatibility
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
