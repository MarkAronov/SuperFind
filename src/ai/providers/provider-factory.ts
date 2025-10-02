import type { AIProvider } from "../ai.interface.js";
import { createAnthropicProvider } from "./anthropic.provider.js";
import { createGeminiProvider } from "./gemini.provider.js";
import { createHuggingFaceProvider } from "./huggingface.provider.js";
import { createOllamaProvider } from "./ollama.provider.js";
import { createOpenAIProvider } from "./openai.provider.js";

/**
 * Get model from environment variables with fallbacks
 */
const getModelFromEnv = (provider: string, fallback: string): string => {
	const envKey = `${provider.toUpperCase()}_MODEL`;
	return process.env[envKey] || fallback;
};

/**
 * Create OpenAI provider with model from environment
 */
export const createOpenAI = (model?: string, apiKey?: string): AIProvider => {
	const modelName = model || getModelFromEnv("openai", "gpt-4o-mini");
	return createOpenAIProvider(modelName, apiKey);
};

/**
 * Create Ollama provider with model from environment
 */
export const createOllama = (model?: string, baseUrl?: string): AIProvider => {
	const modelName = model || getModelFromEnv("ollama", "llama3.2");
	return createOllamaProvider(modelName, baseUrl);
};

/**
 * Create Anthropic Claude provider with model from environment
 */
export const createAnthropic = (
	model?: string,
	apiKey?: string,
): AIProvider => {
	const modelName =
		model || getModelFromEnv("anthropic", "claude-3-5-sonnet-20241022");
	return createAnthropicProvider(modelName, apiKey);
};

/**
 * Create Google Gemini provider with model from environment
 */
export const createGemini = (model?: string, apiKey?: string): AIProvider => {
	const modelName = model || getModelFromEnv("gemini", "gemini-1.5-pro");
	return createGeminiProvider(modelName, apiKey);
};

/**
 * Create Hugging Face provider with model from environment
 */
export const createHuggingFace = (
	model?: string,
	apiKey?: string,
): AIProvider => {
	const modelName =
		model ||
		getModelFromEnv("huggingface", "mistralai/Mistral-7B-Instruct-v0.1");
	return createHuggingFaceProvider(modelName, apiKey);
};

/**
 * Create Anthropic Claude provider with specific model
 */
export const createAnthropic = (
	model = "claude-3-5-sonnet-20241022",
	apiKey?: string,
): AIProvider => {
	return createAnthropicProvider(model, apiKey);
};

/**
 * Create Google Gemini provider with specific model
 */
export const createGemini = (
	model = "gemini-1.5-pro",
	apiKey?: string,
): AIProvider => {
	return createGeminiProvider(model, apiKey);
};

/**
 * Create Hugging Face provider with specific model
 */
export const createHuggingFace = (
	model = "mistralai/Mistral-7B-Instruct-v0.1",
	apiKey?: string,
): AIProvider => {
	return createHuggingFaceProvider(model, apiKey);
};

/**
 * Create provider based on configuration
 */
export const createProvider = (config: ProviderConfig): AIProvider => {
	switch (config.type) {
		case "openai":
			return createOpenAI(config.model, config.apiKey);
		case "ollama":
			return createOllama(config.model, config.baseUrl);
		case "anthropic":
			return createAnthropic(config.model, config.apiKey);
		case "gemini":
			return createGemini(config.model, config.apiKey);
		case "huggingface":
			return createHuggingFace(config.model, config.apiKey);
		default:
			throw new Error(`Unknown provider type: ${config.type}`);
	}
};

/**
 * Get popular model presets
 */
export const getPresets = (): Record<string, ProviderConfig> => {
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

		// Anthropic Claude Models
		"claude-sonnet": {
			type: "anthropic",
			model: "claude-3-5-sonnet-20241022",
			name: "Claude 3.5 Sonnet (Best Reasoning)",
		},
		"claude-opus": {
			type: "anthropic",
			model: "claude-3-opus-20240229",
			name: "Claude 3 Opus (Most Capable)",
		},
		"claude-haiku": {
			type: "anthropic",
			model: "claude-3-haiku-20240307",
			name: "Claude 3 Haiku (Fast & Cheap)",
		},

		// Google Gemini Models
		"gemini-pro": {
			type: "gemini",
			model: "gemini-1.5-pro",
			name: "Gemini 1.5 Pro (Multimodal)",
		},
		"gemini-flash": {
			type: "gemini",
			model: "gemini-1.5-flash",
			name: "Gemini 1.5 Flash (Fast)",
		},

		// Hugging Face Models
		"mistral-7b": {
			type: "huggingface",
			model: "mistralai/Mistral-7B-Instruct-v0.1",
			name: "Mistral 7B Instruct (Open Source)",
		},
		"code-llama": {
			type: "huggingface",
			model: "codellama/CodeLlama-7b-Instruct-hf",
			name: "Code Llama 7B (Coding Specialist)",
		},
		"zephyr-7b": {
			type: "huggingface",
			model: "HuggingFaceH4/zephyr-7b-beta",
			name: "Zephyr 7B (Chat Optimized)",
		},
		"falcon-7b": {
			type: "huggingface",
			model: "tiiuae/falcon-7b-instruct",
			name: "Falcon 7B Instruct (General Purpose)",
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
};

/**
 * Auto-detect best available provider
 */
export const createBestAvailable = async (): Promise<AIProvider> => {
	// Try OpenAI first (if API key exists)
	if (process.env.OPENAI_API_KEY) {
		try {
			const provider = createOpenAI();
			// Test with a simple completion
			await provider.generateCompletion("Hello", { maxTokens: 1 });
			return provider;
		} catch {
			console.log("        → OpenAI not available, trying Anthropic...");
		}
	}

	// Try Anthropic Claude (if API key exists)
	if (process.env.ANTHROPIC_API_KEY) {
		try {
			const provider = createAnthropic();
			await provider.generateCompletion("Hello", { maxTokens: 1 });
			console.log("        ✓ Using Anthropic Claude");
			return provider;
		} catch {
			console.log("        → Anthropic not available, trying Gemini...");
		}
	}

	// Try Google Gemini (if API key exists)
	if (process.env.GOOGLE_API_KEY) {
		try {
			const provider = createGemini();
			await provider.generateCompletion("Hello", { maxTokens: 1 });
			console.log("        ✓ Using Google Gemini");
			return provider;
		} catch {
			console.log("        → Gemini not available, trying Hugging Face...");
		}
	}

	// Try Hugging Face (if API key exists)
	if (process.env.HUGGINGFACE_API_KEY) {
		try {
			const provider = createHuggingFace();
			await provider.generateCompletion("Hello", { maxTokens: 1 });
			console.log("        ✓ Using Hugging Face");
			return provider;
		} catch {
			console.log("        → Hugging Face not available, trying Ollama...");
		}
	}

	// Try Ollama with common models
	const commonModels = ["llama3.2", "qwen2.5", "mistral", "llama2"];

	for (const model of commonModels) {
		try {
			const provider = createOllama(model);
			// Test with a simple completion to see if model is available
			await provider.generateCompletion("test", { maxTokens: 1 });
			console.log(`        ✓ Using Ollama with model: ${model}`);
			return provider;
		} catch {
			// Model not available, try next one
		}
	}

	throw new Error(
		"No AI providers available. Install Ollama or set API keys for OpenAI, Anthropic, Gemini, or Hugging Face",
	);
};

export interface ProviderConfig {
	type: "openai" | "ollama" | "anthropic" | "gemini" | "huggingface";
	model?: string;
	name?: string;
	apiKey?: string;
	baseUrl?: string;
}
