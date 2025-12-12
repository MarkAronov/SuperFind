import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface PersonDocument {
	id: string | number;
	content: string;
	metadata: {
		data_name?: string;
		data_role?: string;
		data_location?: string;
		data_email?: string;
		data_skills?: string;
		data_experience?: string;
		data_experience_years?: string | number;
		data_description?: string;
		personHash?: string;
		stored_at?: string;
		meta_fileName?: string;
		meta_fileType?: string;
		[key: string]: unknown;
	};
}

export interface PeopleResult {
	success: boolean;
	count: number;
	people: PersonDocument[];
}

interface RateLimitError {
	error: string;
	message: string;
	retryAfter: number;
}

async function fetchAllPeople(limit = 100): Promise<PeopleResult> {
	try {
		const { data } = await axios.get<PeopleResult>(`${API_URL}/ai/people`, {
			params: { limit },
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

export function usePeople(limit = 100, enabled = true) {
	return useQuery({
		queryKey: ["people", limit],
		queryFn: () => fetchAllPeople(limit),
		enabled,
		staleTime: 1000 * 60 * 10, // 10 minutes - people list doesn't change often
		retry: (failureCount, error) => {
			// Don't retry on rate limit errors
			if (error instanceof Error && error.message.includes("Rate limit")) {
				return false;
			}
			return failureCount < 2;
		},
	});
}
