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
	const nameMatch = content.match(/^([A-Z][a-zA-Z\s.'-]+)(?:\s+is|\s+from|,)/i) || 
	                  content.match(/name[:\s]+([A-Z][a-zA-Z\s.'-]+)/i);
	if (nameMatch) person.name = nameMatch[1].trim();

	// Extract location
	const locationMatch = content.match(/location[:\s]+([^,\n]+)/i) ||
	                     content.match(/from\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|\s+is|\s+role)/i);
	if (locationMatch) person.location = locationMatch[1].trim();

	// Extract role
	const roleMatch = content.match(/role[:\s]+([^,\n]+)/i) ||
	                 content.match(/is\s+a[n]?\s+([A-Z][a-zA-Z\s]+?)(?:\.|,|\s+from|\s+with)/i);
	if (roleMatch) person.role = roleMatch[1].trim();

	// Extract skills
	const skillsMatch = content.match(/skills?[:\s]+([^,\n]+(?:;[^,\n]+)*)/i);
	if (skillsMatch) person.skills = skillsMatch[1].trim();

	// Extract experience years
	const expMatch = content.match(/experience[_\s]*years?[:\s]+(\d+)/i) ||
	                content.match(/(\d+)\s+years?\s+(?:of\s+)?experience/i);
	if (expMatch) person.experience_years = Number.parseInt(expMatch[1], 10);

	// Extract email
	const emailMatch = content.match(/email[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i) ||
	                  content.match(/contact[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i) ||
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

		// Parse person data from each source
		const people = result.sources.map((source) => {
			const personData = parsePersonFromContent(source.content);
			console.log("        → Parsed person:", personData);
			return {
				...personData,
				relevanceScore: source.metadata?.score || 0.8,
				rawContent: source.content, // Keep original for reference
			};
		});

		console.log("        → Total people parsed:", people.length);

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
