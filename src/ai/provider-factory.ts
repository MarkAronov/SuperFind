import type { AIProvider } from "./ai-provider.interface.js";
import { OllamaProvider } from "./providers/ollama-provider.js";
import { OpenAIProvider } from "./providers/openai-provider.js";

/**
 * Create OpenAI provider with specific model
 */
export function createOpenAI(model = "gpt-5-mini", apiKey?: string): OpenAIProvider {
	return new OpenAIProvider(model, apiKey);
}

/**
 * Create Ollama provider with specific model
 */
export function createOllama(model?: string, baseUrl?: string): OllamaProvider {
	return new OllamaProvider(model, baseUrl);
}

/**
 * Create provider based on configuration
 */
export function createProvider(config: ProviderConfig): AIProvider {
	switch (config.type) {
		case "openai":
			return createOpenAI(config.model, config.apiKey);
		case "ollama":
			return createOllama(config.model, config.baseUrl);
		default:
			throw new Error(`Unknown provider type: ${config.type}`);
	}
}

/**
 * Get popular model presets
 */
export function getPresets(): Record<string, ProviderConfig> {
	return {
		// OpenAI Models
		"gpt4-mini": {
			type: "openai",
			model: "gpt-4o-mini",
			name: "GPT-4 Mini (Fast & Cheap)",
		},
		gpt4: {
			type: "openai",
			model: "gpt-4",
			name: "GPT-4 (Most Capable)",
		},
		"gpt3.5": {
			type: "openai",
			model: "gpt-3.5-turbo",
			name: "GPT-3.5 Turbo (Balanced)",
		},

		// Local Ollama Models
		qwen: {
			type: "ollama",
			model: "qwen2.5",
			name: "Qwen 2.5 (Chinese & English)",
		},
		llama: {
			type: "ollama",
			model: "llama3.2",
			name: "Llama 3.2 (Meta)",
		},
		mistral: {
			type: "ollama",
			model: "mistral",
			name: "Mistral 7B (French AI)",
		},
		codellama: {
			type: "ollama",
			model: "codellama",
			name: "Code Llama (Coding Specialist)",
		},
		deepseek: {
			type: "ollama",
			model: "deepseek-coder",
			name: "DeepSeek Coder (Code Expert)",
		},
	};
}

/**
 * Auto-detect best available provider
 */
export async function createBestAvailable(): Promise<AIProvider> {
	// Try OpenAI first (if API key exists)
	if (process.env.OPENAI_API_KEY) {
		try {
			const provider = createOpenAI();
			// Test with a simple completion
			await provider.generateCompletion("Hello", { maxTokens: 1 });
			return provider;
		} catch {
			console.log("OpenAI not available, trying Ollama...");
		}
	}

	// Try Ollama with common models
	const commonModels = ["llama3.2", "qwen2.5", "mistral", "llama2"];

	for (const model of commonModels) {
		try {
			const provider = createOllama(model);
			const available = await provider.isModelAvailable(model);
			if (available) {
				console.log(`Using Ollama with model: ${model}`);
				return provider;
			}
		} catch {}
	}

	throw new Error(
		"No AI providers available. Install Ollama or set OPENAI_API_KEY",
	);
}

export interface ProviderConfig {
	type: "openai" | "ollama";
	model?: string;
	name?: string;
	apiKey?: string;
	baseUrl?: string;
}
