import { HuggingFaceInference } from "@langchain/community/llms/hf";
import type { AIProvider, CompletionOptions } from "../ai.interface.js";

/**
 * Hugging Face Provider Implementation using LangChain
 * Supports various Hugging Face models including Code Llama, Zephyr, and others
 */

/**
 * Create Hugging Face provider instance using LangChain's HuggingFaceInference
 */
export const createHuggingFaceProvider = (
	model = "mistralai/Mistral-7B-Instruct-v0.1",
	apiKey?: string,
): AIProvider => {
	const hfApiKey = apiKey || process.env.HUGGINGFACE_API_KEY;

	if (!hfApiKey) {
		throw new Error("Hugging Face API key not provided");
	}

	const languageModel = new HuggingFaceInference({
		model: model,
		apiKey: hfApiKey,
		temperature: 0.7,
		maxTokens: 1000,
	});

	return {
		name: "Hugging Face",
		model: model,
		languageModel,
		generateCompletion: (prompt: string, options?: CompletionOptions) =>
			generateCompletion(languageModel, prompt, options),
		generateStream: (prompt: string, options?: CompletionOptions) =>
			generateStream(languageModel, prompt, options),
	};
};

/**
 * Generate completion using LangChain's HuggingFaceInference
 */
const generateCompletion = async (
	model: HuggingFaceInference,
	prompt: string,
	options?: CompletionOptions,
): Promise<string> => {
	// Format prompt with system message if provided
	let formattedPrompt = prompt;
	if (options?.systemPrompt) {
		formattedPrompt = `${options.systemPrompt}\n\nUser: ${prompt}\nAssistant:`;
	}

	// Create a new model instance with updated configuration if needed
	const configuredModel =
		options?.temperature !== undefined || options?.maxTokens !== undefined
			? new HuggingFaceInference({
					model: model.model,
					apiKey: model.apiKey,
					temperature: options?.temperature ?? 0.7,
					maxTokens: options?.maxTokens ?? 1000,
				})
			: model;

	const response = await configuredModel.invoke(formattedPrompt, {
		stop: options?.stopSequences,
	});

	return response;
};

/**
 * Generate streaming completion using LangChain's HuggingFaceInference
 */
const generateStream = async function* (
	model: HuggingFaceInference,
	prompt: string,
	options?: CompletionOptions,
): AsyncGenerator<string> {
	// Format prompt with system message if provided
	let formattedPrompt = prompt;
	if (options?.systemPrompt) {
		formattedPrompt = `${options.systemPrompt}\n\nUser: ${prompt}\nAssistant:`;
	}

	// Create a new model instance with updated configuration if needed
	const configuredModel =
		options?.temperature !== undefined || options?.maxTokens !== undefined
			? new HuggingFaceInference({
					model: model.model,
					apiKey: model.apiKey,
					temperature: options?.temperature ?? 0.7,
					maxTokens: options?.maxTokens ?? 1000,
				})
			: model;

	const stream = await configuredModel.stream(formattedPrompt, {
		stop: options?.stopSequences,
	});

	for await (const chunk of stream) {
		yield chunk;
	}
};
