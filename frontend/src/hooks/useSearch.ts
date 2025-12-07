import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import type { SearchResult } from "@/types/search.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RateLimitError {
	error: string;
	message: string;
	retryAfter: number;
}

async function searchPeople(query: string): Promise<SearchResult> {
	try {
		const { data } = await axios.get<SearchResult>(`${API_URL}/ai/search`, {
			params: { query },
		});
		return data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.status === 429) {
			const rateLimitData = error.response.data as RateLimitError;
			throw new Error(
				`Rate limit exceeded. Please try again in ${rateLimitData.retryAfter} seconds.`,
			);
		}
		throw error;
	}
}

export function useSearch(query: string, enabled = true) {
	return useQuery({
		queryKey: ["search", query],
		queryFn: () => searchPeople(query),
		enabled: enabled && query.trim().length > 0,
		staleTime: 1000 * 60 * 5,
		retry: (failureCount, error) => {
			// Don't retry on rate limit errors
			if (error instanceof Error && error.message.includes("Rate limit")) {
				return false;
			}
			return failureCount < 1;
		},
	});
}
