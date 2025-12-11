import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import type { VectorStore as LangChainVectorStore } from "@langchain/core/vectorstores";

// Core AI Provider Interface - now using LangChain models
export interface AIProvider {
	name: string;
	model?: string;

	// LangChain model instance
	languageModel: BaseLanguageModel;

	// Core method: generate text completion
	generateCompletion(
		prompt: string,
		options?: CompletionOptions,
	): Promise<string>;

	// Optional: streaming support
	generateStream?(
		prompt: string,
		options?: CompletionOptions,
	): AsyncGenerator<string>;
}

export interface CompletionOptions {
	maxTokens?: number;
	temperature?: number;
	stopSequences?: string[];
	systemPrompt?: string;
}

// AI Task Results
export interface TextToJsonResult {
	success: boolean;
	data: Record<string, unknown>;
	confidence?: number;
	error?: string;
}

export interface SearchResult {
	success: boolean;
	answer: string;
	sources: SearchSource[];
	total?: number;
	hasMore?: boolean;
	confidence?: number;
	error?: string;
}

export interface SearchSource {
	id: string;
	content: string;
	metadata: Record<string, unknown>;
	relevanceScore: number;
}

// Use LangChain's VectorStore instead of custom implementation
export type VectorStore = LangChainVectorStore;

export interface Document {
	id: string;
	content: string;
	metadata: Record<string, unknown>;
}
