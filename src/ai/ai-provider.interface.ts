// Core AI Provider Interface - any LLM can implement this
export interface AIProvider {
	name: string;
	model?: string;

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
	confidence?: number;
	error?: string;
}

export interface SearchSource {
	id: string;
	content: string;
	metadata: Record<string, unknown>;
	relevanceScore: number;
}

// TypeScript Interface parsing
export interface TypeScriptInterface {
	name: string;
	properties: InterfaceProperty[];
}

export interface InterfaceProperty {
	key: string;
	type: string;
	optional: boolean;
	description?: string;
}

// Database/Vector Store abstraction
export interface VectorStore {
	addDocuments(documents: Document[]): Promise<void>;
	search(query: string, limit?: number): Promise<SearchSource[]>;
	delete(id: string): Promise<void>;
}

export interface Document {
	id: string;
	content: string;
	metadata: Record<string, unknown>;
}
