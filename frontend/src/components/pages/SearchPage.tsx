import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Card } from "../atoms/Card";
import { SearchBar } from "../molecules/SearchBar";
import { Header } from "../organisms/Header";
import { SearchResults } from "../organisms/SearchResults";
import { SearchTemplate } from "../templates/SearchTemplate";

export function SearchPage() {
	const [query, setQuery] = useState("");
	const { data, isLoading, error } = useSearch(query);

	return (
		<SearchTemplate
			header={<Header />}
			searchBar={
				<SearchBar
					onSearch={setQuery}
					placeholder="Search for people... (e.g., 'Python developers', 'DevOps from Europe')"
					isLoading={isLoading}
				/>
			}
			error={
				error ? (
					<Card className="mt-4 p-4 bg-red-100 text-red-700">
						<strong>Error:</strong> {error.message}
					</Card>
				) : null
			}
			results={
				data ? <SearchResults data={data} isLoading={isLoading} /> : null
			}
		/>
	);
}
