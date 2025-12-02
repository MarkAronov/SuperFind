import {
	useNavigate,
	useSearch as useSearchParams,
} from "@tanstack/react-router";
import { useSearch } from "@/hooks/useSearch";
import { Card } from "../atoms/Card";
import { SearchBar } from "../molecules/SearchBar";
import { SearchResults } from "../organisms/SearchResults";
import { PageTemplate } from "../templates/PageTemplate";

export function SearchPage() {
	const navigate = useNavigate();
	const searchParams = useSearchParams({ from: "/" });
	const query = (searchParams as { q?: string }).q || "";
	const { data, isLoading, error, refetch } = useSearch(query);

	const handleSearch = (newQuery: string, forceRefetch?: boolean) => {
		if (forceRefetch && newQuery === query) {
			// Same query - just refetch
			refetch();
		} else {
			navigate({
				to: "/",
				search: newQuery.trim() ? { q: newQuery } : {},
				replace: true,
			});
		}
	};

	return (
		<PageTemplate className="bg-transparent">
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
				{data && <SearchResults data={data} isLoading={isLoading} />}

				{/* Hint for browse all - subtle Easter egg */}
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
