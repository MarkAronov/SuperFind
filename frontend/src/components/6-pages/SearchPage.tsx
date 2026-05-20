import { useSearch as useSearchAPI } from "@/hooks/useSearch";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Div } from "../2-atoms/Div";
import { Link } from "../2-atoms/Link";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { ErrorMessage } from "../3-molecules/ErrorMessage";
import { FilterPanel } from "../3-molecules/FilterPanel";
import { Hero } from "../3-molecules/Hero";
import { SearchBar } from "../3-molecules/SearchBar";
import { SearchResults } from "../4-organisms/SearchResults";
import { PageTemplate } from "../5-templates/PageTemplate";
import {
	experienceLabels,
	filterPanelFilters,
	filterSearchIcon,
	heroContent,
	hintContent,
	regionMap,
	roleMap,
	searchBarPlaceholder,
	sortLabels,
} from "./SearchPage.data.tsx";

type SearchParams = {
	q?: string;
	filter?: string;
	experience?: string;
	region?: string;
	role?: string;
	sort?: string;
};

// Helper to extract experience years
const getExperienceYears = (exp: string | number | undefined): number => {
	if (typeof exp === "number") return exp;
	if (typeof exp === "string") {
		const match = exp.match(/(\d+)/);
		return match ? Number.parseInt(match[1], 10) : 0;
	}
	return 0;
};

export const SearchPage = () => {
	const navigate = useNavigate();
	const searchParams = useSearch({ from: "/search" });
	const query = searchParams.q || "";
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 10;

	// Compute offset from page number — drives which page the API fetches
	const offset = (currentPage - 1) * limit;

	// Filter states (synced with URL)
	const filterSearch = (searchParams as SearchParams).filter || "";
	const experienceFilter = (searchParams as SearchParams).experience || "all";
	const regionFilter = (searchParams as SearchParams).region || "all";
	const roleFilter = (searchParams as SearchParams).role || "all";
	const sortBy = (searchParams as SearchParams).sort || "relevance";

	// Fetch data from API — offset changes automatically when currentPage changes
	const { data, isLoading, error, refetch } = useSearchAPI(query, {
		enabled: true,
		limit,
		offset,
	});

	// Reset to page 1 whenever the search query changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: query change should reset page
	useEffect(() => {
		setCurrentPage(1);
	}, [query]);

	// Apply client-side filtering and sorting to the current page's results
	const filteredData = useMemo(() => {
		if (!data) return null;
		if (!data.people) {
			return { ...data, people: [] };
		}

		let filtered = [...data.people];

		// Apply filter search
		if (filterSearch.trim()) {
			const q = filterSearch.toLowerCase();
			filtered = filtered.filter((person) => {
				const searchableText = [
					person.name,
					person.role,
					person.location,
					person.city,
					person.country,
					person.description,
					person.skills,
				]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();
				return searchableText.includes(q);
			});
		}

		// Apply experience filter
		if (experienceFilter !== "all") {
			filtered = filtered.filter((person) => {
				const years = getExperienceYears(
					person.experience_years || person.experience,
				);
				switch (experienceFilter) {
					case "entry":
						return years < 2;
					case "junior":
						return years >= 2 && years < 5;
					case "mid":
						return years >= 5 && years < 10;
					case "senior":
						return years >= 10 && years < 15;
					case "expert":
						return years >= 15;
					default:
						return true;
				}
			});
		}

		// Apply region filter — keyword list lives in SearchPage.data.tsx
		if (regionFilter !== "all") {
			filtered = filtered.filter((person) => {
				// Combine all location-related fields so city-only or country-only records match correctly
				const locationStr = [person.location, person.country, person.city]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();
				const keywords = regionMap[regionFilter] || [];
				return keywords.some((k) => locationStr.includes(k));
			});
		}

		// Apply role filter — keyword list lives in SearchPage.data.tsx
		if (roleFilter !== "all") {
			filtered = filtered.filter((person) => {
				// Search role and description for broader coverage
				const roleText = [person.role, person.description]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();
				const keywords = roleMap[roleFilter] || [];
				return keywords.some((k) => roleText.includes(k));
			});
		}

		// Apply sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "experience-high":
					return (
						getExperienceYears(b.experience_years || b.experience) -
						getExperienceYears(a.experience_years || a.experience)
					);
				case "experience-low":
					return (
						getExperienceYears(a.experience_years || a.experience) -
						getExperienceYears(b.experience_years || b.experience)
					);
				case "name-asc":
					return (a.name || "").localeCompare(b.name || "");
				case "name-desc":
					return (b.name || "").localeCompare(a.name || "");
				default: // relevance
					return (b.relevanceScore || 0) - (a.relevanceScore || 0);
			}
		});

		return {
			...data,
			people: filtered,
		};
	}, [data, filterSearch, experienceFilter, regionFilter, roleFilter, sortBy]);

	// Calculate active filters
	const activeFilters = useMemo(() => {
		const filters = [];
		if (filterSearch)
			filters.push({
				id: "search",
				type: "search",
				value: filterSearch,
				label: `"${filterSearch}"`,
			});
		if (experienceFilter !== "all") {
			filters.push({
				id: "experience",
				type: "experience",
				value: experienceFilter,
				// Label comes from the shared map in SearchPage.data.tsx
				label: experienceLabels[experienceFilter],
			});
		}
		if (regionFilter !== "all")
			filters.push({
				id: "region",
				type: "region",
				value: regionFilter,
				label: regionFilter
					.replace("-", " ")
					.replace(/\b\w/g, (l: string) => l.toUpperCase()),
			});
		if (roleFilter !== "all")
			filters.push({
				id: "role",
				type: "role",
				value: roleFilter,
				label: roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1),
			});
		if (sortBy !== "relevance") {
			filters.push({
				id: "sort",
				type: "sort",
				value: sortBy,
				// Label comes from the shared map in SearchPage.data.tsx
				label: sortLabels[sortBy],
			});
		}
		return filters;
	}, [filterSearch, experienceFilter, regionFilter, roleFilter, sortBy]);

	const handleSearch = (newQuery: string, forceRefetch?: boolean) => {
		// Reset to first page on every new search
		setCurrentPage(1);
		if (forceRefetch && newQuery === query) {
			refetch();
		} else {
			navigate({
				to: "/search",
				search: newQuery.trim() ? { q: newQuery } : {},
			});
		}
	};

	const clearAllFilters = () => {
		navigate({
			to: "/search",
			search: (prev) => ({
				q: prev.q,
				filter: undefined,
				experience: undefined,
				region: undefined,
				role: undefined,
				sort: undefined,
			}),
			replace: true,
		});
	};

	const removeFilter = (id: string) => {
		const updates: Record<string, undefined> = {};
		if (id === "search") updates.filter = undefined;
		if (id === "experience") updates.experience = undefined;
		if (id === "region") updates.region = undefined;
		if (id === "role") updates.role = undefined;
		if (id === "sort") updates.sort = undefined;

		navigate({
			to: "/search",
			search: (prev) => ({ ...prev, ...updates }),
			replace: true,
		});
	};

	return (
		<PageTemplate title="Search">
			{/* Hero Section */}
			<Hero
				title={heroContent.title}
				brand={heroContent.brand}
				subtitle={heroContent.subtitle}
			/>

			{/* Search Bar */}
			<SearchBar
				onSearch={handleSearch}
				placeholder={searchBarPlaceholder}
				isLoading={isLoading}
				initialValue={query}
			/>

			{/* Error Message */}
			{error && <ErrorMessage message={error.message} className="mt-4" />}

			{/* Filter Panel - Only show when we have search results */}
			{data?.people && data.people.length > 0 && (
				<Card className="mt-6 overflow-hidden">
					<CardContent className="p-0">
						<FilterPanel
							variant="compact"
							search={{
								value: filterSearch,
								onChange: (value) =>
									navigate({
										to: "/search",
										search: (prev) => ({ ...prev, filter: value || undefined }),
										replace: true,
									}),
								placeholder: "Filter by name, role, skills...",
								icon: filterSearchIcon,
							}}
							// Filter definitions (options + icons) come from SearchPage.data.tsx
							filters={filterPanelFilters}
							filterValues={{
								experience: experienceFilter,
								region: regionFilter,
								role: roleFilter,
								sort: sortBy,
							}}
							onFilterChange={(filterId, value) => {
								const updates: Record<string, string | undefined> = {};
								if (filterId === "experience")
									updates.experience = value === "all" ? undefined : value;
								if (filterId === "region")
									updates.region = value === "all" ? undefined : value;
								if (filterId === "role")
									updates.role = value === "all" ? undefined : value;
								if (filterId === "sort")
									updates.sort = value === "relevance" ? undefined : value;

								navigate({
									to: "/search",
									search: (prev) => ({ ...prev, ...updates }),
									replace: true,
								});
							}}
							activeFilters={activeFilters}
							onRemoveFilter={removeFilter}
							onClearAll={clearAllFilters}
							resultsCount={filteredData?.people?.length || 0}
							totalCount={
								filteredData?.people?.length !== data?.people?.length
									? data?.people?.length
									: undefined
							}
						/>
					</CardContent>
				</Card>
			)}

			{/* Search Results — includes numbered pagination bar */}
			{filteredData && (
				<SearchResults
					data={filteredData}
					isLoading={isLoading}
					pagination={{
						currentPage,
						// Calculate total pages from API's total count + page size
						totalPages: Math.max(1, Math.ceil((data?.total ?? 0) / limit)),
						onPageChange: setCurrentPage,
					}}
				/>
			)}

			{/* Hint for browse all — content from SearchPage.data.tsx */}
			{!query && (
				<Div variant="center" className="mt-8">
					<Text variant="caption">
						{hintContent.text}{" "}
						<Link to={hintContent.linkTo} variant="underline">
							{hintContent.linkLabel}
						</Link>{" "}
						{hintContent.suffix}
					</Text>
				</Div>
			)}
		</PageTemplate>
	);
};
