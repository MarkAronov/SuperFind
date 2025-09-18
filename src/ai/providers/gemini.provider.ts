import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { AIProvider, CompletionOptions } from "../ai.interface.js";

/**
 * Google Gemini Provider Implementation using LangChain
 * Supports Gemini Pro, Gemini Flash, and other Google AI models
 */

/**
 * Create Google Gemini provider instance using LangChain's ChatGoogleGenerativeAI
 */
export const createGeminiProvider = (
	model = "gemini-1.5-pro",
	apiKey?: string,
): AIProvider => {
	const googleApiKey = apiKey || process.env.GOOGLE_API_KEY;

	if (!googleApiKey) {
		throw new Error("Google API key not provided");
	}

	const languageModel = new ChatGoogleGenerativeAI({
		model: model,
		apiKey: googleApiKey,
		temperature: 0.7,
		maxOutputTokens: 1000,
	});

	return {
		name: "Google Gemini",
		model: model,
		languageModel,
		generateCompletion: (prompt: string, options?: CompletionOptions) =>
			generateCompletion(languageModel, prompt, options),
		generateStream: (prompt: string, options?: CompletionOptions) =>
			generateStream(languageModel, prompt, options),
	};
};

/**
 * Generate completion using LangChain's ChatGoogleGenerativeAI
 */
const generateCompletion = async (
	model: ChatGoogleGenerativeAI,
	prompt: string,
	options?: CompletionOptions,
): Promise<string> => {
	// Create a new model instance with options if provided
	const configuredModel = new ChatGoogleGenerativeAI({
		...model,
		temperature: options?.temperature ?? 0.7,
		maxOutputTokens: options?.maxTokens ?? 1000,
		stopSequences: options?.stopSequences,
	});

	// Format prompt with system message if provided
	const messages = [];
	if (options?.systemPrompt) {
		messages.push(new SystemMessage(options.systemPrompt));
	}
	messages.push(new HumanMessage(prompt));

	const response = await configuredModel.invoke(messages);
	return response.content as string;
};

/**
 * Generate streaming completion using LangChain's ChatGoogleGenerativeAI
 */
const generateStream = async function* (
	model: ChatGoogleGenerativeAI,
	prompt: string,
	options?: CompletionOptions,
): AsyncGenerator<string> {
	// Create a new model instance with options if provided
	const configuredModel = new ChatGoogleGenerativeAI({
		...model,
		temperature: options?.temperature ?? 0.7,
		maxOutputTokens: options?.maxTokens ?? 1000,
		stopSequences: options?.stopSequences,
	});

	// Format prompt with system message if provided
	const messages = [];
	if (options?.systemPrompt) {
		messages.push(new SystemMessage(options.systemPrompt));
	}
	messages.push(new HumanMessage(prompt));

	const stream = await configuredModel.stream(messages);

	for await (const chunk of stream) {
		if (chunk.content) {
			yield chunk.content as string;
		}
	}
};
