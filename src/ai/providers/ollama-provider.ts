import type { AIProvider, CompletionOptions } from "./ai-provider.interface.js";

/**
 * Ollama Provider Implementation (supports any local LLM model)
 * Supports: Qwen, Llama, Mistral, CodeLlama, and many others
 */

// Provider configuration
interface OllamaConfig {
	name: string;
	model: string;
	baseUrl: string;
}

/**
 * Create Ollama provider instance
 */
export const createOllamaProvider = (
	model?: string,
	baseUrl = "http://localhost:11434",
): AIProvider => {
	const config: OllamaConfig = {
		name: "Ollama",
		model: model || "llama3.2", // Default to a common model
		baseUrl,
	};

	const provider: AIProvider = {
		name: config.name,
		model: config.model,
		generateCompletion: (prompt: string, options?: CompletionOptions) =>
			generateCompletion(config, prompt, options),
		generateStream: (prompt: string, options?: CompletionOptions) =>
			generateStream(config, prompt, options),
	};

	// Add Ollama-specific methods as additional properties
	return Object.assign(provider, {
		setModel: (newModel: string) => setModel(config, newModel),
		listAvailableModels: () => listAvailableModels(config),
		isModelAvailable: (modelName: string) =>
			isModelAvailable(config, modelName),
	});
};

/**
 * Set or change the model at runtime
 */
const setModel = (config: OllamaConfig, model: string): void => {
	config.model = model;
};

/**
 * List available models from Ollama
 */
const listAvailableModels = async (config: OllamaConfig): Promise<string[]> => {
	try {
		const response = await fetch(`${config.baseUrl}/api/tags`);
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
	config: OllamaConfig,
	modelName: string,
): Promise<boolean> => {
	const availableModels = await listAvailableModels(config);
	return availableModels.includes(modelName);
};

/**
 * Generate completion using Ollama API
 */
const generateCompletion = async (
	config: OllamaConfig,
	prompt: string,
	options?: CompletionOptions,
): Promise<string> => {
	const fullPrompt = options?.systemPrompt
		? `${options.systemPrompt}\n\nUser: ${prompt}\nAssistant:`
		: prompt;

	const response = await fetch(`${config.baseUrl}/api/generate`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: config.model,
			prompt: fullPrompt,
			stream: false,
			options: {
				num_predict: options?.maxTokens || 1000,
				temperature: options?.temperature || 0.7,
				stop: options?.stopSequences,
			},
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Ollama API error: ${response.status} - ${error}`);
	}

	const data = await response.json();
	return data.response || "";
};

/**
 * Generate streaming completion using Ollama API
 */
const generateStream = async function* (
	config: OllamaConfig,
	prompt: string,
	options?: CompletionOptions,
): AsyncGenerator<string> {
	const fullPrompt = options?.systemPrompt
		? `${options.systemPrompt}\n\nUser: ${prompt}\nAssistant:`
		: prompt;

	const response = await fetch(`${config.baseUrl}/api/generate`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: config.model,
			prompt: fullPrompt,
			stream: true,
			options: {
				num_predict: options?.maxTokens || 1000,
				temperature: options?.temperature || 0.7,
				stop: options?.stopSequences,
			},
		}),
	});

	if (!response.ok) {
		throw new Error(`Ollama API error: ${response.status}`);
	}

	const reader = response.body?.getReader();
	if (!reader) throw new Error("No response body");

	const decoder = new TextDecoder();

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value);
		const lines = chunk.split("\n").filter((line) => line.trim());

		for (const line of lines) {
			try {
				const parsed = JSON.parse(line);
				if (parsed.response) {
					yield parsed.response;
				}
				if (parsed.done) return;
			} catch {
				// Skip invalid JSON
			}
		}
	}
};
