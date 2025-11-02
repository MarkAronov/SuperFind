/**
 * Environment configuration helper for SkillVector
 */

/**
 * Get all current model configurations from environment
 */
export function getCurrentModelConfig() {
	return {
		ai_models: {
			openai: process.env.OPENAI_MODEL || "gpt-4o-mini",
			anthropic: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
			gemini: process.env.GEMINI_MODEL || "gemini-1.5-pro",
			huggingface:
				process.env.HUGGINGFACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.1",
			ollama: process.env.OLLAMA_MODEL || "llama3.2",
		},
		embedding_models: {
			openai_small:
				process.env.OPENAI_SMALL_EMBEDDING_MODEL || "text-embedding-3-small",
			openai_large:
				process.env.OPENAI_LARGE_EMBEDDING_MODEL || "text-embedding-3-large",
			ollama: process.env.OLLAMA_EMBEDDING_MODEL || "mxbai-embed-large",
			huggingface:
				process.env.HUGGINGFACE_EMBEDDING_MODEL ||
				"sentence-transformers/all-MiniLM-L6-v2",
			huggingface_bge:
				process.env.HUGGINGFACE_BGE_EMBEDDING_MODEL || "BAAI/bge-large-en-v1.5",
			google: process.env.GOOGLE_EMBEDDING_MODEL || "text-embedding-004",
		},
		api_keys: {
			openai: !!process.env.OPENAI_API_KEY,
			anthropic: !!process.env.ANTHROPIC_API_KEY,
			google: !!process.env.GOOGLE_API_KEY,
			huggingface: !!process.env.HUGGINGFACE_API_KEY,
		},
		qdrant: {
			host: process.env.QDRANT_HOST || "localhost",
			port: process.env.QDRANT_PORT || "6333",
			protocol: process.env.QDRANT_PROTOCOL || "http",
			has_api_key: !!process.env.QDRANT_API_KEY,
		},
	};
}

/**
 * Log current configuration at startup
 */
export function logCurrentConfiguration() {
	const config = getCurrentModelConfig();

	console.log("\n📋 Current Model Configuration:");
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

	// Available AI Providers
	console.log("\n🤖 Available AI Providers:");
	Object.entries(config.api_keys).forEach(([provider, available]) => {
		const model = config.ai_models[provider as keyof typeof config.ai_models];
		const status = available ? "✅" : "❌";
		console.log(`    ${status} ${provider.toUpperCase()}: ${model}`);
	});

	// Embedding Models
	console.log("\n🔍 Embedding Models:");
	console.log(`    OpenAI Small: ${config.embedding_models.openai_small}`);
	console.log(`    OpenAI Large: ${config.embedding_models.openai_large}`);
	console.log(`    Ollama Local: ${config.embedding_models.ollama}`);
	console.log(`    Hugging Face: ${config.embedding_models.huggingface}`);
	console.log(`    Google: ${config.embedding_models.google}`);

	// Qdrant Configuration
	console.log("\n🗃️  Vector Database:");
	console.log(
		`    Qdrant: ${config.qdrant.protocol}://${config.qdrant.host}:${config.qdrant.port}`,
	);
	console.log(
		`    API Key: ${config.qdrant.has_api_key ? "✅ Configured" : "❌ Not set"}`,
	);

	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

	return config;
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
	const errors: string[] = [];
	const config = getCurrentModelConfig();

	// Check if at least one AI provider is configured
	const hasAnyProvider = Object.values(config.api_keys).some(Boolean);
	if (!hasAnyProvider) {
		errors.push(
			"No AI provider API keys configured. Please set at least one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY, HUGGINGFACE_API_KEY",
		);
	}

	// Validate Ollama URL if no cloud providers
	if (!hasAnyProvider && !process.env.OLLAMA_BASE_URL) {
		errors.push(
			"No cloud AI providers configured and OLLAMA_BASE_URL not set. Please configure at least one AI provider.",
		);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
