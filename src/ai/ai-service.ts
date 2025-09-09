import type {
	AIProvider,
	SearchResult,
	TextToJsonResult,
	VectorStore,
} from "./providers/ai-provider.interface";

/**
 * Main AI Service - handles the 2 core tasks:
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
 * TASK 1: Convert text to JSON using TypeScript interface keys
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

		// Create AI prompt for text-to-JSON conversion
		const prompt = createTextToJsonPrompt(text, interfaceKeys, hint);

		// Call AI provider
		const response = await provider.generateCompletion(prompt, {
			temperature: 0.1, // Low temp for structured output
			maxTokens: 1000,
		});

		// Extract and parse JSON from response
		const jsonData = parseJsonFromResponse(response, interfaceKeys);

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
 * TASK 2: Search database and generate AI-powered answer
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

		// Retrieve relevant documents
		const sources = await vectorStore.search(query, limit);

		if (sources.length === 0) {
			return {
				success: true,
				answer: "I couldn't find any relevant information for your query.",
				sources: [],
			};
		}

		// Create context from retrieved sources
		const context = sources
			.map((source) => `Source ${source.id}: ${source.content}`)
			.join("\n\n");

		// Generate AI-powered answer
		const prompt = createSearchAnswerPrompt(query, context);

		const answer = await provider.generateCompletion(prompt, {
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
}; /**
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
 * Helper: Create prompt for text-to-JSON conversion
 */
const createTextToJsonPrompt = (
	text: string,
	keys: string[],
	hint?: string,
): string => {
	const keysDescription = keys.map((key) => `"${key}"`).join(", ");

	return `Extract information from the following text and return ONLY a valid JSON object.
					Required keys: ${keysDescription} ${hint ? `Focus on extracting: ${hint}` : ""}
					Text to analyze:
					"""
					${text}
					"""
					Instructions:
					- Return ONLY the JSON object, no explanations
					- Use the exact key names provided
					- If a key's value is not found, use empty string ""
					- Ensure valid JSON format
					Example format: {"${keys[0]}": "value1", "${keys[1]}": "value2"}`;
};

/**
 * Helper: Create prompt for search answer generation
 */
const createSearchAnswerPrompt = (query: string, context: string): string => {
	return `Answer the following question based ONLY on the provided context. If the context doesn't contain enough information, say so.
					Question: 
					${query}

					Context:
					${context}

					Instructions:
					- Provide a clear, concise answer
					- Only use information from the context
					- If unsure, mention the uncertainty
					- Cite specific sources when possible`;
};

/**
 * Helper: Parse JSON from AI response
 */
const parseJsonFromResponse = (
	response: string,
	expectedKeys: string[],
): Record<string, unknown> => {
	try {
		// Try to extract JSON from response
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			throw new Error("No JSON found in response");
		}

		const parsed = JSON.parse(jsonMatch[0]);

		// Ensure all expected keys exist
		const result: Record<string, unknown> = {};
		for (const key of expectedKeys) {
			result[key] = parsed[key] || "";
		}

		return result;
	} catch {
		// Fallback: create empty object with expected keys
		const fallback: Record<string, unknown> = {};
		for (const key of expectedKeys) {
			fallback[key] = "";
		}
		return fallback;
	}
};
