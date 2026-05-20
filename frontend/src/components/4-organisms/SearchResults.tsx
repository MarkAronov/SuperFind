import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { PersonSearchResult } from "@/types/search.types";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { PaginationBar } from "../2-atoms/Pagination";
import { Text } from "../2-atoms/Text";
import { Card } from "../3-molecules/Card";
import { PersonCard } from "../3-molecules/PersonCard";
import { ViewToggle } from "../3-molecules/ViewToggle";
import { Grid } from "../4-organisms/Grid";
import type { SearchResultsProps } from "./SearchResults.types";

export const SearchResults = ({
	data,
	isLoading,
	pagination,
}: SearchResultsProps) => {
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
		} catch {
			/* Ignore localStorage errors - not critical */
		}
	}, [view]);

	if (isLoading) {
		return (
			<Div
				className={cn(
					// Spacing
					"mt-4",
					// Typography
					"text-center text-muted-foreground",
				)}
			>
				Searching...
			</Div>
		);
	}

	// Show error if search failed
	if (!data.success && data.error) {
		return (
			<Card
				className={cn(
					// Spacing
					"mt-8 p-6",
					// Colors
					"border-red-200 text-red-700",
				)}
			>
				<Heading variant="section" className="mb-2">
					Error
				</Heading>
				<Text className="text-red-600">{data.error}</Text>
				{data.details && (
					<Text variant="small" className="text-red-500 mt-2">
						{data.details}
					</Text>
				)}
			</Card>
		);
	}

	return (
		<Div
			className={cn(
				// Spacing
				"mt-8 space-y-6",
			)}
		>
			{/* AI Answer Section */}
			{data.answer && (
				<Card className="p-6 border-primary/30">
					<Heading variant="section" className="mb-2">
						AI Summary
					</Heading>
					<Text className="text-foreground whitespace-pre-wrap">
						{data.answer}
					</Text>
				</Card>
			)}

			{/* Results Section */}
			<Div>
				{/* View toggle and heading */}
				<Div
					className={cn(
						// Layout
						"flex items-center justify-between",
						// Spacing
						"mb-4",
					)}
				>
					<Heading variant="section">
						{uniquePeople.length > 0 ? (
							<>
								Found {uniquePeople.length} people
								{uniquePeople.length !== people.length && (
									<Text variant="small" className="ml-2" as="span">
										({people.length - uniquePeople.length} duplicates removed)
									</Text>
								)}
							</>
						) : (
							"No results found"
						)}
					</Heading>

					{/* View Toggle */}
					<ViewToggle view={view} onViewChange={setView} />
				</Div>

				{uniquePeople.length > 0 ? (
					<Grid
						maxColumns={view === "grid" ? 3 : 1}
						items={uniquePeople.map((item, index) => ({
							id: `${item.person.name}-${index}`,
							noWrapper: true,
							customContent: (
								<PersonCard
									key={`${item.person.name}-${index}`}
									person={item}
									view={view}
								/>
							),
						}))}
					/>
				) : (
					<Card className="p-6 text-center text-muted-foreground">
						<Text>No people found matching your search criteria.</Text>
						<Text variant="small" className="mt-2">
							Try adjusting your search terms.
						</Text>
					</Card>
				)}
			</Div>

			{/* Numbered pagination bar — rendered by the PaginationBar atom */}
			{pagination && (
				<PaginationBar
					currentPage={pagination.currentPage}
					totalPages={pagination.totalPages}
					onPageChange={pagination.onPageChange}
					className="mt-8"
				/>
			)}
		</Div>
	);
};
