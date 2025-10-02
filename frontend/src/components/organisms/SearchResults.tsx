import type { SearchResult } from "@/types/api";
import { Card } from "../atoms/Card";
import { PersonCard } from "../molecules/PersonCard";
import { useMemo } from "react";

interface SearchResultsProps {
	data: SearchResult;
	isLoading?: boolean;
}

export function SearchResults({ data, isLoading }: SearchResultsProps) {
	// Use people array if available, otherwise fall back to empty array
	const people = data.people || [];
	
	console.log("SearchResults - data.people:", data.people);
	console.log("SearchResults - people length:", people.length);

	// Deduplicate people by name (only if name exists)
	const uniquePeople = useMemo(() => {
		if (!people || people.length === 0) return [];
		
		// Filter out any undefined/null entries first
		const validPeople = people.filter((person) => person !== null && person !== undefined);
		
		console.log("Valid people count:", validPeople.length);
		
		const seen = new Set<string>();
		return validPeople.filter((person) => {
			// Skip if no name
			if (!person.name) return true;
			
			// Create a hash from name + role
			const personHash = `${person.name}-${person.role || 'unknown'}`.toLowerCase();
			if (seen.has(personHash)) {
				return false;
			}
			seen.add(personHash);
			return true;
		});
	}, [people]);

	if (isLoading) {
		return <div className="mt-4 text-center text-gray-500">Searching...</div>;
	}

	return (
		<div className="mt-8 space-y-6">
			{/* AI Answer Section */}
			<Card className="p-6 bg-blue-50">
				<h2 className="text-xl font-semibold mb-2">AI Answer</h2>
				<p className="text-gray-700 whitespace-pre-wrap">{data.answer}</p>
			</Card>

			{/* Results Section */}
			<div>
				<h2 className="text-xl font-semibold mb-4">
					Found {uniquePeople.length} people
					{uniquePeople.length !== people.length && (
						<span className="text-sm text-gray-500 ml-2">
							({people.length - uniquePeople.length} duplicates removed)
						</span>
					)}
				</h2>

				<div className="grid gap-4">
					{uniquePeople.map((person, index) => (
						<PersonCard key={`${person.name}-${index}`} person={person} />
					))}
				</div>
			</div>
		</div>
	);
}
