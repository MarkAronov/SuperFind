import type { AIProvider, CompletionOptions } from "./ai-provider.interface.js";

/**
 * OpenAI Provider Implementation
 */

// Provider configuration
interface OpenAIConfig {
	name: string;
	model: string;
	apiKey: string;
}

/**
 * Create OpenAI provider instance
 */
export const createOpenAIProvider = (
	model = "gpt-4o-mini",
	apiKey?: string,
): AIProvider => {
	const config: OpenAIConfig = {
		name: "OpenAI",
		model,
		apiKey: apiKey || process.env.OPENAI_API_KEY || "",
	};

	if (!config.apiKey) {
		throw new Error("OpenAI API key not provided");
	}

	return {
		name: config.name,
		model: config.model,
		generateCompletion: (prompt: string, options?: CompletionOptions) =>
			generateCompletion(config, prompt, options),
		generateStream: (prompt: string, options?: CompletionOptions) =>
			generateStream(config, prompt, options),
	};
};

/**
 * Generate completion using OpenAI API
 */
const generateCompletion = async (
	config: OpenAIConfig,
	prompt: string,
	options?: CompletionOptions,
): Promise<string> => {
	const messages = [];

	if (options?.systemPrompt) {
		messages.push({ role: "system", content: options.systemPrompt });
	}

	messages.push({ role: "user", content: prompt });

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${config.apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: config.model,
			messages,
			max_tokens: options?.maxTokens || 1000,
			temperature: options?.temperature || 0.7,
			stop: options?.stopSequences,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${response.status} - ${error}`);
	}

	const data = await response.json();
	return data.choices[0]?.message?.content || "";
};

/**
 * Generate streaming completion using OpenAI API
 */
const generateStream = async function* (
	config: OpenAIConfig,
	prompt: string,
	options?: CompletionOptions,
): AsyncGenerator<string> {
	const messages = [];

	if (options?.systemPrompt) {
		messages.push({ role: "system", content: options.systemPrompt });
	}

	messages.push({ role: "user", content: prompt });

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${config.apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: config.model,
			messages,
			max_tokens: options?.maxTokens || 1000,
			temperature: options?.temperature || 0.7,
			stop: options?.stopSequences,
			stream: true,
		}),
	});

	if (!response.ok) {
		throw new Error(`OpenAI API error: ${response.status}`);
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
			if (line.startsWith("data: ")) {
				const data = line.slice(6);
				if (data === "[DONE]") return;

				try {
					const parsed = JSON.parse(data);
					const content = parsed.choices[0]?.delta?.content;
					if (content) yield content;
				} catch {
					// Skip invalid JSON
				}
			}
		}
	}
};
