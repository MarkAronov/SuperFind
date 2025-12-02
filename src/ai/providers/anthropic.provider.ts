import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AIProvider, CompletionOptions } from "../types";

/**
 * Anthropic Claude Provider Implementation using LangChain
 * Supports Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
 */

/**
 * Create Anthropic Claude provider instance using LangChain's ChatAnthropic
 */
export const createAnthropicProvider = (
	model = "claude-3-5-sonnet-20241022",
	apiKey?: string,
): AIProvider => {
	const anthropicKey = apiKey || process.env.ANTHROPIC_API_KEY;

	if (!anthropicKey) {
		throw new Error("Anthropic API key not provided");
	}

	const languageModel = new ChatAnthropic({
		model: model,
		apiKey: anthropicKey,
		temperature: 0.7,
		maxTokens: 1000,
	});

	return {
		name: "Anthropic",
		model: model,
		languageModel,
		generateCompletion: (prompt: string, options?: CompletionOptions) =>
			generateCompletion(languageModel, prompt, options),
		generateStream: (prompt: string, options?: CompletionOptions) =>
			generateStream(languageModel, prompt, options),
	};
};

/**
 * Generate completion using LangChain's ChatAnthropic
 */
const generateCompletion = async (
	model: ChatAnthropic,
	prompt: string,
	options?: CompletionOptions,
): Promise<string> => {
	// Create a new model instance with options if provided
	const configuredModel = new ChatAnthropic({
		...model,
		temperature: options?.temperature ?? 0.7,
		maxTokens: options?.maxTokens ?? 1000,
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
 * Generate streaming completion using LangChain's ChatAnthropic
 */
const generateStream = async function* (
	model: ChatAnthropic,
	prompt: string,
	options?: CompletionOptions,
): AsyncGenerator<string> {
	// Create a new model instance with options if provided
	const configuredModel = new ChatAnthropic({
		...model,
		temperature: options?.temperature ?? 0.7,
		maxTokens: options?.maxTokens ?? 1000,
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
