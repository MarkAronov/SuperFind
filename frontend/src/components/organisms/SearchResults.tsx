import { useMemo } from "react";
import type { PersonSearchResult, SearchResult } from "@/types/search.types";
import { Card } from "../atoms/Card";
import { PersonCard } from "../molecules/PersonCard";

interface SearchResultsProps {
	data: SearchResult;
	isLoading?: boolean;
}

export function SearchResults({ data, isLoading }: SearchResultsProps) {
	// Parse people from sources if people array doesn't exist
	const people = useMemo((): PersonSearchResult[] => {
		if (data.people && data.people.length > 0) {
			return data.people;
		}

		// Fallback: parse from sources
		if (data.sources && data.sources.length > 0) {
			return data.sources.map((source): PersonSearchResult => {
				const content = source.content;

				// Try to parse as JSON first
				try {
					const jsonMatch = content.match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						// Validate JSON structure (parsing for verification)
						JSON.parse(jsonMatch[0]);
						return {
							id: source.id || Math.random().toString(),
							score: source.relevanceScore || 0.8,
							person: {
								name: "Unknown",
								location: "Unknown",
								role: "Unknown",
								skills: "Unknown",
								experience: 0,
								description: "",
							},
							metadata: {
								rawContent: content,
							},
						};
					}
				} catch {
					// Not JSON, continue with regex parsing
				}

				// Extract person data from plain text content
				const nameMatch = content.match(
					/^([A-Z][a-zA-Z\s.'-]+?)(?:\s+is\s+|\s+from\s+|,)/i,
				);
				const locationMatch = content.match(
					/from\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|\s+Skills|$)/i,
				);
				const roleMatch = content.match(
					/is\s+a[n]?\s+([A-Z][a-zA-Z\s&]+?)(?:\s+from|\.|,|$)/i,
				);
				const skillsMatch = content.match(/Skills?:\s*([^.\n]+)/i);
				const expMatch = content.match(/Experience:\s*(\d+)\s*years?/i);
				const emailMatch = content.match(
					/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/,
				);

				return {
					id: source.id || Math.random().toString(),
					score: source.relevanceScore || 0.8,
					person: {
						name: nameMatch?.[1]?.trim() || "Unknown",
						location: locationMatch?.[1]?.trim() || "Unknown",
						role: roleMatch?.[1]?.trim() || "Unknown",
						skills:
							skillsMatch?.[1]?.trim().replace(/\s*;\s*/g, "; ") || "Unknown",
						experience: expMatch?.[1] ? Number.parseInt(expMatch[1], 10) : 0,
						description: "",
						email: emailMatch?.[1]?.trim(),
					},
					metadata: {
						rawContent: content,
					},
				};
			});
		}

		return [];
	}, [data.people, data.sources]);

	// Deduplicate people by name and normalize data
	const uniquePeople = useMemo(() => {
		if (!people || people.length === 0) return [];

		// Filter out any undefined/null entries and people without names
		const validPeople = people.filter(
			(item) => item?.person?.name && item.person.name !== "Unknown",
		);

		const seen = new Map<string, (typeof validPeople)[0]>();

		for (const item of validPeople) {
			// Create a normalized hash from name only (case-insensitive)
			const personKey = item.person.name.toLowerCase().trim();

			// If we've seen this person, keep the one with more complete data
			const existing = seen.get(personKey);
			if (existing) {
				// Count non-empty fields
				const existingScore = [
					existing.person.email,
					existing.person.location,
					existing.person.role,
					existing.person.skills,
				].filter((f) => f && f.length > 0).length;
				const newScore = [
					item.person.email,
					item.person.location,
					item.person.role,
					item.person.skills,
				].filter((f) => f && f.length > 0).length;

				// Keep the one with more data, or higher relevance score if tied
				if (
					newScore > existingScore ||
					(newScore === existingScore && item.score > existing.score)
				) {
					seen.set(personKey, item);
				}
			} else {
				seen.set(personKey, item);
			}
		}

		return Array.from(seen.values()).sort((a, b) => b.score - a.score);
	}, [people]);

	if (isLoading) {
		return <div className="mt-4 text-center text-gray-500">Searching...</div>;
	}

	// Show error if search failed
	if (!data.success && data.error) {
		return (
			<Card className="mt-8 p-6 bg-red-50">
				<h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
				<p className="text-red-600">{data.error}</p>
				{data.details && (
					<p className="text-sm text-red-500 mt-2">{data.details}</p>
				)}
			</Card>
		);
	}

	return (
		<div className="mt-8 space-y-6">
			{/* AI Answer Section */}
			{data.answer && (
				<Card className="p-6 bg-blue-50">
					<h2 className="text-xl font-semibold mb-2">AI Summary</h2>
					<p className="text-gray-700 whitespace-pre-wrap">{data.answer}</p>
				</Card>
			)}

			{/* Results Section */}
			<div>
				<h2 className="text-xl font-semibold mb-4">
					{uniquePeople.length > 0 ? (
						<>
							Found {uniquePeople.length} people
							{uniquePeople.length !== people.length && (
								<span className="text-sm text-gray-500 ml-2">
									({people.length - uniquePeople.length} duplicates removed)
								</span>
							)}
						</>
					) : (
						"No results found"
					)}
				</h2>

				{uniquePeople.length > 0 ? (
					<div className="grid gap-4">
						{uniquePeople.map((item, index) => (
							<PersonCard key={`${item.person.name}-${index}`} person={item} />
						))}
					</div>
				) : (
					<Card className="p-6 text-center text-gray-500">
						<p>No people found matching your search criteria.</p>
						<p className="text-sm mt-2">Try adjusting your search terms.</p>
					</Card>
				)}
			</div>
		</div>
	);
}
