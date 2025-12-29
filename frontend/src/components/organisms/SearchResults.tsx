import { useEffect, useMemo, useState } from "react";
import type { PersonSearchResult, SearchResult } from "@/types/search.types";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { PersonCard } from "../molecules/PersonCard";

interface SearchResultsProps {
	data: SearchResult;
	isLoading?: boolean;
}

export function SearchResults({ data, isLoading }: SearchResultsProps) {
	// Parse people from the data
	const people = useMemo((): PersonSearchResult[] => {
		// If we have people array from the backend (flat structure)
		if (data.people && data.people.length > 0) {
			return data.people.map((person, index) => ({
				id: index.toString(),
				score: person.relevanceScore || 0.8,
				person: {
					name: person.name || "Unknown",
					location: person.location || "Unknown",
					role: person.role || "Unknown",
					skills: person.skills || "Unknown",
					experience: person.experience_years || person.experience || 0,
					description: person.description || "",
					email: person.email || "",
				},
				metadata: {
					rawContent: person.rawContent,
				},
			}));
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
								email: "",
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
						email: emailMatch?.[1]?.trim() || "",
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

	// Persisted view preference (grid | row)
	const [view, setView] = useState<"grid" | "row">(() => {
		try {
			const v = localStorage.getItem("resultsView");
			return v === "row" ? "row" : "grid";
		} catch {
			return "grid";
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem("resultsView", view);
		} catch {}
	}, [view]);

	if (isLoading) {
		return (
			<div className="mt-4 text-center text-muted-foreground">Searching...</div>
		);
	}

	// Show error if search failed
	if (!data.success && data.error) {
		return (
			<Card className="mt-8 p-6 border-red-200 text-red-700">
				<h2 className="text-xl font-semibold mb-2">Error</h2>
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
				<Card className="p-6 border-primary/30">
					<h2 className="text-xl font-semibold mb-2">AI Summary</h2>
					<p className="text-foreground whitespace-pre-wrap">{data.answer}</p>
				</Card>
			)}

			{/* Results Section */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">
						{uniquePeople.length > 0 ? (
							<>
								Found {uniquePeople.length} people
								{uniquePeople.length !== people.length && (
									<span className="text-sm text-muted-foreground ml-2">
										({people.length - uniquePeople.length} duplicates removed)
									</span>
								)}
							</>
						) : (
							"No results found"
						)}
					</h2>

					{/* View Toggle */}
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant={view === "grid" ? "outline" : "default"}
							onClick={() => setView("grid")}
							aria-pressed={view === "grid"}
							title="Grid view"
						>
							Grid
						</Button>
						<Button
							size="sm"
							variant={view === "row" ? "outline" : "default"}
							onClick={() => setView("row")}
							aria-pressed={view === "row"}
							title="List view"
						>
							List
						</Button>
					</div>
				</div>

				{uniquePeople.length > 0 ? (
					view === "grid" ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{uniquePeople.map((item, index) => (
								<PersonCard
									key={`${item.person.name}-${index}`}
									person={item}
									view="grid"
								/>
							))}
						</div>
					) : (
						<div className="space-y-4">
							{uniquePeople.map((item, index) => (
								<PersonCard
									key={`${item.person.name}-${index}`}
									person={item}
									view="row"
								/>
							))}
						</div>
					)
				) : (
					<Card className="p-6 text-center text-muted-foreground">
						<p>No people found matching your search criteria.</p>
						<p className="text-sm mt-2">Try adjusting your search terms.</p>
					</Card>
				)}
			</div>
		</div>
	);
}
