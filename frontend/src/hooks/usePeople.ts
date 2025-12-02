import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
		md5?: string;
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

async function fetchAllPeople(limit = 100): Promise<PeopleResult> {
	const { data } = await axios.get<PeopleResult>(`${API_URL}/ai/people`, {
		params: { limit },
	});
	return data;
}

export function usePeople(limit = 100, enabled = true) {
	return useQuery({
		queryKey: ["people", limit],
		queryFn: () => fetchAllPeople(limit),
		enabled,
		staleTime: 1000 * 60 * 10, // 10 minutes - people list doesn't change often
		retry: 2,
	});
}
