import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import type { AIProvider, CompletionOptions } from "../ai.interface.js";

/**
 * OpenAI Provider Implementation using LangChain
 */

/**
 * Create OpenAI provider instance using LangChain's ChatOpenAI
 */
export const createOpenAIProvider = (
	model = "gpt-4o-mini",
	apiKey?: string,
): AIProvider => {
	const openAIKey = apiKey || process.env.OPENAI_API_KEY;

	if (!openAIKey) {
		throw new Error("OpenAI API key not provided");
	}

	const languageModel = new ChatOpenAI({
		model: model,
		apiKey: openAIKey,
		temperature: 0.7,
		maxTokens: 1000,
	});

	return {
		name: "OpenAI",
		model: model,
		languageModel,
		generateCompletion: (prompt: string, options?: CompletionOptions) =>
			generateCompletion(languageModel, prompt, options),
		generateStream: (prompt: string, options?: CompletionOptions) =>
			generateStream(languageModel, prompt, options),
	};
};

/**
 * Generate completion using LangChain's ChatOpenAI
 */
const generateCompletion = async (
	model: ChatOpenAI,
	prompt: string,
	options?: CompletionOptions,
): Promise<string> => {
	// Create a new model instance with options if provided
	const configuredModel = new ChatOpenAI({
		...model,
		temperature: options?.temperature ?? 0.7,
		maxTokens: options?.maxTokens ?? 1000,
		stop: options?.stopSequences,
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
 * Generate streaming completion using LangChain's ChatOpenAI
 */
const generateStream = async function* (
	model: ChatOpenAI,
	prompt: string,
	options?: CompletionOptions,
): AsyncGenerator<string> {
	// Create a new model instance with options if provided
	const configuredModel = new ChatOpenAI({
		...model,
		temperature: options?.temperature ?? 0.7,
		maxTokens: options?.maxTokens ?? 1000,
		stop: options?.stopSequences,
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
