export interface Person {
	id: string;
	name: string;
	role: string;
	location: string;
	skills: string[] | string;
	email?: string;
	description?: string;
}

export interface SearchResult {
	success: boolean;
	query?: string;
	answer?: string;
	people: Person[];
	total: number;
	limit: number;
	offset: number;
	hasMore?: boolean;
}

export interface SkillVectorOptions {
	baseUrl?: string; // e.g. https://api.skillvector.app
	apiKey?: string; // optional - for future authentication
	retry?: {
		retries?: number;
		backoffMs?: number; // initial backoff in ms
	};
}

export class SkillVectorClient {
	private baseUrl: string;
	private apiKey?: string;
	private retries: number;
	private backoffMs: number;

	constructor(options?: SkillVectorOptions) {
		this.baseUrl = options?.baseUrl || "http://localhost:3000";
		this.apiKey = options?.apiKey;
		this.retries = options?.retry?.retries ?? 2;
		this.backoffMs = options?.retry?.backoffMs ?? 250;
	}

	private buildQueryString(
		params: Record<string, string | number | undefined>,
	) {
		return Object.entries(params)
			.filter(([, v]) => v !== undefined)
			.map(
				([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
			)
			.join("&");
	}

	private async requestWithRetry<T>(
		path: string,
		params?: Record<string, string | number | undefined>,
	) {
		return this.requestInternal<T>(path, params);
	}

	private async requestInternal<T>(
		path: string,
		params?: Record<string, string | number | undefined>,
		attempt = 0,
	): Promise<T> {
		const url = `${this.baseUrl}${path}${params ? `?${this.buildQueryString(params)}` : ""}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (this.apiKey) {
			headers["Authorization"] = `Bearer ${this.apiKey}`;
		}

		try {
			const resp = await fetch(url, { method: "GET", headers });
			if (!resp.ok) {
				throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
			}
			const json = (await resp.json()) as T;
			return json;
		} catch (err) {
			const shouldRetry = attempt < this.retries;
			if (shouldRetry) {
				const backoff = this.backoffMs * 2 ** attempt;
				await new Promise((res) => setTimeout(res, backoff));
				return this.requestInternal<T>(path, params, attempt + 1);
			}
			throw err;
		}
	}

	async search(query: string, limit = 10, offset = 0) {
		return this.requestWithRetry<SearchResult>("/ai/search", {
			query,
			limit,
			offset,
		});
	}

	async getPeople(limit = 100) {
		return this.requestWithRetry<{
			success: boolean;
			count: number;
			people: Person[];
		}>("/ai/people", { limit });
	}

	// Advanced helper: accepts a filter object and converts it to query params
	async searchWithFilters(
		query: string,
		filters: {
			skills?: string[] | string;
			location?: string;
			role?: string;
			minExperience?: number;
			maxExperience?: number;
		},
		limit = 10,
		offset = 0,
	) {
		const params: Record<string, string | number | undefined> = {
			query,
			limit,
			offset,
		};
		if (filters.skills) {
			params.skills = Array.isArray(filters.skills)
				? filters.skills.join(",")
				: filters.skills;
		}
		if (filters.location) params.location = filters.location;
		if (filters.role) params.role = filters.role;
		if (filters.minExperience !== undefined)
			params.minExperience = filters.minExperience;
		if (filters.maxExperience !== undefined)
			params.maxExperience = filters.maxExperience;

		return this.requestWithRetry<SearchResult>("/ai/search", params);
	}

	// Iterates over pages and yields Person objects (useful for streaming results)
	async *searchPaginated(query: string, limit = 10) {
		let offset = 0;
		while (true) {
			const results = await this.search(query, limit, offset);
			for (const p of results.people) yield p;
			if (!results.hasMore) break;
			offset += limit;
		}
	}
}
