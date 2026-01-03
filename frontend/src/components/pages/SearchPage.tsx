import {
	useNavigate,
	useSearch as useSearchParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import type { SearchResult } from "@/types/search.types";
import { Button } from "../atoms/Button";
import { Div } from "../atoms/Div";
import { Hero } from "../atoms/Hero";
import { Link } from "../atoms/Link";
import { Text } from "../atoms/Text";
import { ErrorMessage } from "../molecules/ErrorMessage";
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
		<PageTemplate>
			{/* Hero Section */}
			<Hero
				title="Find the "
				brand="Perfect Talent"
				subtitle="Semantic search powered by AI. Search by skills, experience, location, and more."
			/>

			{/* Search Bar */}
			<SearchBar
				onSearch={handleSearch}
				placeholder="Search for people... (e.g., 'Python developers', 'DevOps from Europe')"
				isLoading={isLoading}
				initialValue={query}
			/>

			{/* Error Message */}
			{error && <ErrorMessage message={error.message} className="mt-4" />}

			{/* Search Results */}
			{accumulatedData && (
				<SearchResults data={accumulatedData} isLoading={isLoading} />
			)}

			{/* Load More Button */}
			{accumulatedData?.hasMore && (
				<Div variant="center" className="mt-8">
					<Button
						type="button"
						onClick={handleLoadMore}
						disabled={isLoading}
						className="max-w-xs"
					>
						{isLoading ? "Loading..." : "Load More Results"}
					</Button>
				</Div>
			)}

			{/* Pagination Info */}
			{accumulatedData?.people && accumulatedData.people.length > 0 && (
				<Div variant="center" className="mt-4">
					<Text variant="small">
						Showing {accumulatedData.people.length} of{" "}
						{accumulatedData.total || accumulatedData.people.length} results
					</Text>
				</Div>
			)}

			{/* Hint for browse all*/}
			{!query && (
				<Div variant="center" className="mt-8">
					<Text variant="caption">
						Tip: Visit{" "}
						<Link to="/people" variant="underline">
							/people
						</Link>{" "}
						to see everyone
					</Text>
				</Div>
			)}
		</PageTemplate>
	);
}
