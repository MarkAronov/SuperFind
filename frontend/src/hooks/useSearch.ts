import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { SearchResult } from "@/types/api";

async function searchPeople(query: string): Promise<SearchResult> {
	const { data } = await axios.get<SearchResult>(
		"http://localhost:3000/ai/search",
		{
			params: { query },
		},
	);
	console.log("API Response:", data);
	console.log("People array:", data.people);
	console.log("Sources array:", data.sources);
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
