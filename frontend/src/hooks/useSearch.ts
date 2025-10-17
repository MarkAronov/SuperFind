import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { SearchResult } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function searchPeople(query: string): Promise<SearchResult> {
	const { data } = await axios.get<SearchResult>(`${API_URL}/ai/search`, {
		params: { query },
	});
	return data;
}

export function useSearch(query: string, enabled = true) {
	return useQuery({
		queryKey: ["search", query],
		queryFn: () => searchPeople(query),
		enabled: enabled && query.trim().length > 0,
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});
}
