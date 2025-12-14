import {
	useNavigate,
	useSearch as useSearchParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import type { SearchResult } from "@/types/search.types";
import { Card } from "../atoms/Card";
import { SearchBar } from "../molecules/SearchBar";
import { SearchResults } from "../organisms/SearchResults";
import { PageTemplate } from "../templates/PageTemplate";

export function SearchPage() {
	const navigate = useNavigate();
	const searchParams = useSearchParams({ from: "/" });
	const query = (searchParams as { q?: string }).q || "";
	const [offset, setOffset] = useState(0);
	const [accumulatedData, setAccumulatedData] = useState<SearchResult | null>(
		null,
	);
	const limit = 10;

	const { data, isLoading, error, refetch } = useSearch(query, {
		enabled: true,
		limit,
		offset,
	});

	// Accumulate results when new data arrives
	useEffect(() => {
		if (data) {
			if (offset === 0) {
				// First page - replace all data
				setAccumulatedData(data);
			} else {
				// Subsequent pages - append to existing data
				setAccumulatedData((prev) => {
					if (!prev) return data;
					return {
						...data,
						people: [...(prev.people || []), ...(data.people || [])],
					};
				});
			}
		}
	}, [data, offset]);

	// Reset accumulated data when query changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: query change should reset state
	useEffect(() => {
		setOffset(0);
		setAccumulatedData(null);
	}, [query]);

	const handleSearch = (newQuery: string, forceRefetch?: boolean) => {
		setOffset(0);
		setAccumulatedData(null);
		if (forceRefetch && newQuery === query) {
			// Same query - just refetch
			refetch();
		} else {
			navigate({
				to: "/",
				search: newQuery.trim() ? { q: newQuery } : {},
			});
		}
	};

	const handleLoadMore = () => {
		if (accumulatedData?.hasMore) {
			setOffset((prev) => prev + limit);
		}
	};

	return (
		<PageTemplate className="bg-transparent" title={query || "Search"}>
			<div className="max-w-5xl mx-auto">
				{/* Hero Section */}

				<div className="text-center mb-16">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4">
						Find the{" "}
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							Perfect Talent
						</span>
					</h1>
					<p className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
						Semantic search powered by AI. Search by skills, experience,
						location, and more.
					</p>
				</div>

				{/* Search Bar */}
				<SearchBar
					onSearch={handleSearch}
					placeholder="Search for people... (e.g., 'Python developers', 'DevOps from Europe')"
					isLoading={isLoading}
					initialValue={query}
				/>

				{/* Error Message */}
				{error && (
					<Card className="mt-4 p-4 bg-red-100 text-red-700">
						<strong>Error:</strong> {error.message}
					</Card>
				)}

				{/* Search Results */}
				{accumulatedData && (
					<SearchResults data={accumulatedData} isLoading={isLoading} />
				)}

				{/* Load More Button */}
				{accumulatedData?.hasMore && (
					<div className="mt-8 flex justify-center">
						<button
							type="button"
							onClick={handleLoadMore}
							disabled={isLoading}
							className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? "Loading..." : "Load More Results"}
						</button>
					</div>
				)}

				{/* Pagination Info */}
				{accumulatedData?.people && accumulatedData.people.length > 0 && (
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Showing {accumulatedData.people.length} of{" "}
						{accumulatedData.total || accumulatedData.people.length} results
					</div>
				)}

				{/* Hint for browse all*/}
				{!query && (
					<div className="mt-8 text-center">
						<p className="text-xs text-muted-foreground/50">
							Tip: Visit{" "}
							<button
								type="button"
								onClick={() => navigate({ to: "/people" })}
								className="underline hover:text-muted-foreground/70 transition-colors"
							>
								/people
							</button>{" "}
							to see everyone
						</p>
					</div>
				)}
			</div>
		</PageTemplate>
	);
}
