// API Response Types
export interface SearchResult {
	success: boolean;
	query: string;
	answer?: string; // Optional - may not be present in error cases
	people?: Person[]; // Optional - may not be present in error cases
	sources?: Source[]; // Optional - may not be present in error cases
	timestamp: string;
	error?: string; // Optional - present in error cases
	details?: string; // Optional - present in error cases
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
