import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OllamaEmbeddings } from "@langchain/ollama";
import { OpenAIEmbeddings } from "@langchain/openai";

export type EmbeddingProvider =
	| "openai-small"
	| "openai-large"
	| "ollama"
	| "huggingface"
	| "google";

export interface EmbeddingConfig {
	provider: EmbeddingProvider;
	model?: string;
	apiKey?: string;
	baseUrl?: string;
	dimensions?: number;
}

/**
 * Get embedding model from environment variables with fallbacks
 */
const getEmbeddingModelFromEnv = (
	provider: string,
	fallback: string,
): string => {
	const envKey = `${provider.toUpperCase()}_EMBEDDING_MODEL`;
	return process.env[envKey] || fallback;
};

/**
 * Embedding models optimized for different use cases
 */
export const EMBEDDING_PRESETS: Record<string, EmbeddingConfig> = {
	// OpenAI models
	"openai-small": {
		provider: "openai-small",
		model: getEmbeddingModelFromEnv("openai_small", "text-embedding-3-small"),
		dimensions: 1536,
	},
	"openai-large": {
		provider: "openai-large",
		model: getEmbeddingModelFromEnv("openai_large", "text-embedding-3-large"),
		dimensions: 3072,
	},

	// Ollama local models (free, private)
	"ollama-nomic": {
		provider: "ollama",
		model: getEmbeddingModelFromEnv("ollama", "nomic-embed-text"),
		dimensions: 768,
	},
	"ollama-mxbai": {
		provider: "ollama",
		model: getEmbeddingModelFromEnv("ollama_mxbai", "mxbai-embed-large"),
		dimensions: 1024,
	},

	// Hugging Face models
	"hf-sentence-transformers": {
		provider: "huggingface",
		model: getEmbeddingModelFromEnv(
			"huggingface",
			"sentence-transformers/all-MiniLM-L6-v2",
		),
		dimensions: 384,
	},
	"hf-bge-large": {
		provider: "huggingface",
		model: getEmbeddingModelFromEnv(
			"huggingface_bge",
			"BAAI/bge-large-en-v1.5",
		),
		dimensions: 1024,
	},

	// Google models
	"google-gecko": {
		provider: "google",
		model: getEmbeddingModelFromEnv("google", "text-embedding-004"),
		dimensions: 768,
	},
};

/**
 * Create embedding provider based on configuration
 */
export function createEmbeddingProvider(config: EmbeddingConfig) {
	switch (config.provider) {
		case "openai-small":
		case "openai-large":
			return new OpenAIEmbeddings({
				model: config.model || "text-embedding-3-small",
				openAIApiKey: config.apiKey || process.env.OPENAI_API_KEY,
			});

		case "ollama":
			return new OllamaEmbeddings({
				model: config.model || "nomic-embed-text",
				baseUrl:
					config.baseUrl ||
					process.env.OLLAMA_BASE_URL ||
					"http://localhost:11434",
			});

		case "huggingface":
			return new HuggingFaceInferenceEmbeddings({
				model: config.model || "sentence-transformers/all-MiniLM-L6-v2",
				apiKey: config.apiKey || process.env.HUGGINGFACE_API_KEY,
			});

		case "google":
			return new GoogleGenerativeAIEmbeddings({
				model: config.model || "text-embedding-004",
				apiKey: config.apiKey || process.env.GOOGLE_API_KEY,
			});

		default:
			throw new Error(`Unsupported embedding provider: ${config.provider}`);
	}
}

/**
 * Get recommended embedding model based on available API keys
 */
export function getBestAvailableEmbedding(): EmbeddingConfig {
	// Auto-select best available embedding model based on API keys

	if (process.env.OPENAI_API_KEY) {
		return EMBEDDING_PRESETS["openai-large"]; // Best quality
	}

	if (process.env.HUGGINGFACE_API_KEY) {
		return EMBEDDING_PRESETS["hf-bge-large"]; // Good alternative
	}

	// Fall back to local Ollama if available (free but requires local setup)
	return EMBEDDING_PRESETS["ollama-mxbai"];
} /**
 * Get embedding model details for Qdrant collection configuration
 */
export function getEmbeddingDimensions(config: EmbeddingConfig): number {
	return (
		config.dimensions || EMBEDDING_PRESETS[config.provider]?.dimensions || 1536
	);
}
