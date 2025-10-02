// API Response Types
export interface SearchResult {
	success: boolean;
	query: string;
	answer: string;
	people: Person[];
	sources: Source[];
	timestamp: string;
}

export interface Source {
	id: string;
	content: string;
	metadata: Record<string, unknown>;
	relevanceScore: number;
}

// Parsed Person Data (from source content)
export interface Person {
	name: string;
	location: string;
	role: string;
	skills: string | string[];
	experience_years: number;
	email: string;
	relevanceScore: number;
	rawContent?: string;
	[key: string]: unknown; // Allow additional fields
}

// API Error
export interface ApiError {
	message: string;
	status?: number;
}
