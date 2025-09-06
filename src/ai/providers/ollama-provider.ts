import type {
	AIProvider,
	CompletionOptions,
} from "../ai-provider.interface.js";

/**
 * Ollama Provider Implementation (supports any local LLM model)
 * Supports: Qwen, Llama, Mistral, CodeLlama, and many others
 */
export class OllamaProvider implements AIProvider {
	name = "Ollama";
	model: string;
	private baseUrl: string;

	constructor(model?: string, baseUrl = "http://localhost:11434") {
		this.model = model || "llama3.2"; // Default to a common model
		this.baseUrl = baseUrl;
	}

	/**
	 * Set or change the model at runtime
	 */
	setModel(model: string): void {
		this.model = model;
	}

	/**
	 * List available models from Ollama
	 */
	async listAvailableModels(): Promise<string[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/tags`);
			if (!response.ok) {
				throw new Error(`Failed to fetch models: ${response.status}`);
			}
			
			const data = await response.json();
			return data.models?.map((model: any) => model.name) || [];
		} catch (error) {
			console.warn('Could not fetch Ollama models:', error);
			return [];
		}
	}

	/**
	 * Check if a specific model is available
	 */
	async isModelAvailable(modelName: string): Promise<boolean> {
		const availableModels = await this.listAvailableModels();
		return availableModels.includes(modelName);
	}

	async generateCompletion(
		prompt: string,
		options?: CompletionOptions,
	): Promise<string> {
		const fullPrompt = options?.systemPrompt
			? `${options.systemPrompt}\n\nUser: ${prompt}\nAssistant:`
			: prompt;

		const response = await fetch(`${this.baseUrl}/api/generate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: this.model,
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
	}

	async *generateStream(
		prompt: string,
		options?: CompletionOptions,
	): AsyncGenerator<string> {
		const fullPrompt = options?.systemPrompt
			? `${options.systemPrompt}\n\nUser: ${prompt}\nAssistant:`
			: prompt;

		const response = await fetch(`${this.baseUrl}/api/generate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: this.model,
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
	}
}
