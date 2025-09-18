import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";
import type { AIProvider, CompletionOptions } from "../ai.interface.js";

/**
 * Ollama Provider Implementation using LangChain
 * Supports: Qwen, Llama, Mistral, CodeLlama, and many others
 */

/**
 * Create Ollama provider instance using LangChain's ChatOllama
 */
export const createOllamaProvider = (
	model?: string,
	baseUrl = "http://localhost:11434",
): AIProvider => {
	const languageModel = new ChatOllama({
		model: model || "llama3.2", // Default to a common model
		baseUrl,
		temperature: 0.7,
	});

	const provider: AIProvider = {
		name: "Ollama",
		model: model || "llama3.2",
		languageModel,
		generateCompletion: (prompt: string, options?: CompletionOptions) =>
			generateCompletion(languageModel, prompt, options),
		generateStream: (prompt: string, options?: CompletionOptions) =>
			generateStream(languageModel, prompt, options),
	};

	// Add Ollama-specific methods as additional properties
	return Object.assign(provider, {
		setModel: (newModel: string) => setModel(languageModel, newModel),
		listAvailableModels: () => listAvailableModels(baseUrl),
		isModelAvailable: (modelName: string) =>
			isModelAvailable(baseUrl, modelName),
	});
};

/**
 * Set or change the model at runtime
 */
const setModel = (model: ChatOllama, newModel: string): void => {
	// Create new model instance with the new model name
	Object.assign(model, { model: newModel });
};

/**
 * List available models from Ollama
 */
const listAvailableModels = async (baseUrl: string): Promise<string[]> => {
	try {
		const response = await fetch(`${baseUrl}/api/tags`);
		if (!response.ok) {
			throw new Error(`Failed to fetch models: ${response.status}`);
		}

		const data = await response.json();
		return data.models?.map((model: { name: string }) => model.name) || [];
	} catch (error) {
		console.warn("Could not fetch Ollama models:", error);
		return [];
	}
};

/**
 * Check if a specific model is available
 */
const isModelAvailable = async (
	baseUrl: string,
	modelName: string,
): Promise<boolean> => {
	const availableModels = await listAvailableModels(baseUrl);
	return availableModels.includes(modelName);
};

/**
 * Generate completion using LangChain's ChatOllama
 */
const generateCompletion = async (
	model: ChatOllama,
	prompt: string,
	options?: CompletionOptions,
): Promise<string> => {
	// Create a new model instance with options if provided
	const configuredModel = new ChatOllama({
		...model,
		temperature: options?.temperature ?? 0.7,
		numPredict: options?.maxTokens ?? 1000,
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
 * Generate streaming completion using LangChain's ChatOllama
 */
const generateStream = async function* (
	model: ChatOllama,
	prompt: string,
	options?: CompletionOptions,
): AsyncGenerator<string> {
	// Create a new model instance with options if provided
	const configuredModel = new ChatOllama({
		...model,
		temperature: options?.temperature ?? 0.7,
		numPredict: options?.maxTokens ?? 1000,
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
