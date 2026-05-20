import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { SearchResult } from "@/types/search.types";
import { SearchResults } from "./SearchResults";

const meta: Meta<typeof SearchResults> = {
	title: "Organisms/SearchResults",
	component: SearchResults,
	parameters: {
		// padded gives the results grid room to breathe
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

// ---------------------------------------------------------------------------
// Shared mock data — realistic people used across multiple stories
// ---------------------------------------------------------------------------
const TIMESTAMP = new Date().toISOString();

// A single page of 6 people (enough to populate the grid)
const mockPeople: SearchResult["people"] = [
	{
		name: "Sarah Chen",
		role: "Senior Frontend Engineer",
		location: "San Francisco, CA",
		skills: "TypeScript, React, GraphQL, CSS, Storybook",
		experience: 7,
		experience_years: 7,
		description: "Passionate about design systems and accessible UIs.",
		email: "sarah.chen@example.com",
		relevanceScore: 0.97,
	},
	{
		name: "Marcus Johnson",
		role: "Full-Stack Developer",
		location: "Austin, TX",
		skills: "Node.js, React, PostgreSQL, Docker, AWS",
		experience: 5,
		experience_years: 5,
		description: "Enjoys building scalable backends and clean REST APIs.",
		email: "marcus.j@example.com",
		relevanceScore: 0.93,
	},
	{
		name: "Priya Nair",
		role: "Product Designer",
		location: "Remote — India",
		skills: "Figma, UX Research, Prototyping, Design Tokens",
		experience: 4,
		experience_years: 4,
		description: "Bridges the gap between design and engineering.",
		email: "priya.nair@example.com",
		relevanceScore: 0.89,
	},
	{
		name: "Leon Müller",
		role: "DevOps Engineer",
		location: "Berlin, Germany",
		skills: "Kubernetes, Terraform, CI/CD, Python, Linux",
		experience: 6,
		experience_years: 6,
		description: "Automates everything from provisioning to deployments.",
		email: "leon.mueller@example.com",
		relevanceScore: 0.85,
	},
	{
		name: "Aiko Tanaka",
		role: "ML Engineer",
		location: "Tokyo, Japan",
		skills: "Python, PyTorch, NLP, Vector Search, FastAPI",
		experience: 3,
		experience_years: 3,
		description:
			"Specialises in semantic search and retrieval-augmented generation.",
		email: "aiko.tanaka@example.com",
		relevanceScore: 0.82,
	},
	{
		name: "Carlos Reyes",
		role: "Backend Engineer",
		location: "Mexico City, Mexico",
		skills: "Go, gRPC, Redis, Kafka, PostgreSQL",
		experience: 8,
		experience_years: 8,
		description: "Builds high-throughput distributed systems.",
		email: "carlos.r@example.com",
		relevanceScore: 0.78,
	},
];

// Convenience factory for a standard successful search result
const makeResult = (overrides?: Partial<SearchResult>): SearchResult => ({
	success: true,
	query: "frontend engineer",
	people: mockPeople,
	total: mockPeople.length,
	timestamp: TIMESTAMP,
	...overrides,
});

// ---------------------------------------------------------------------------
// Empty — no people returned, no error
// ---------------------------------------------------------------------------
export const Empty: Story = {
	render: () => <SearchResults data={makeResult({ people: [], total: 0 })} />,
};

// ---------------------------------------------------------------------------
// WithResults — six people, no pagination (single page)
// ---------------------------------------------------------------------------
export const WithResults: Story = {
	render: () => <SearchResults data={makeResult()} />,
};

// ---------------------------------------------------------------------------
// WithAIAnswer — AI summary card rendered above the results grid
// ---------------------------------------------------------------------------
export const WithAIAnswer: Story = {
	render: () => (
		<SearchResults
			data={makeResult({
				answer:
					"I found 6 frontend engineers matching your search. The top results include senior-level candidates with strong TypeScript and React backgrounds, several of whom have experience building design systems. Most are open to remote work.",
			})}
		/>
	),
};

// ---------------------------------------------------------------------------
// Loading — shows the "Searching…" placeholder state
// ---------------------------------------------------------------------------
export const Loading: Story = {
	render: () => (
		<SearchResults data={makeResult({ people: [] })} isLoading={true} />
	),
};

// ---------------------------------------------------------------------------
// WithError — displays the error card when success=false
// ---------------------------------------------------------------------------
export const WithError: Story = {
	render: () => (
		<SearchResults
			data={{
				success: false,
				query: "frontend engineer",
				timestamp: TIMESTAMP,
				error: "Search service unavailable",
				details: "Failed to connect to the vector database. Please try again.",
			}}
		/>
	),
};

// ---------------------------------------------------------------------------
// WithPagination — results on page 1 of 5 with the PaginationBar rendered below
// ---------------------------------------------------------------------------
export const WithPagination: Story = {
	render: () => (
		<SearchResults
			data={makeResult({ total: 50 })}
			pagination={{
				currentPage: 1,
				totalPages: 5,
				onPageChange: (_: number) => undefined,
			}}
		/>
	),
};

// ---------------------------------------------------------------------------
// InteractivePagination — fully interactive: clicking pages updates state
// The component re-fetches in a real app; here we just show the bar in action
// ---------------------------------------------------------------------------
const InteractivePaginationWrapper = () => {
	const [page, setPage] = useState(1);
	const totalPages = 5;

	return (
		<div className="flex flex-col gap-2">
			{/* Simulated page indicator */}
			<p className="text-sm text-muted-foreground text-center">
				Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> —
				in a real app the results would reload on page change
			</p>
			<SearchResults
				data={makeResult({ total: 50 })}
				pagination={{
					currentPage: page,
					totalPages,
					onPageChange: setPage,
				}}
			/>
		</div>
	);
};

export const InteractivePagination: Story = {
	render: () => <InteractivePaginationWrapper />,
};

// ---------------------------------------------------------------------------
// MiddlePage — pagination bar shows ellipsis on both sides (page 5 of 10)
// ---------------------------------------------------------------------------
export const MiddlePage: Story = {
	render: () => (
		<SearchResults
			data={makeResult({ total: 100 })}
			pagination={{
				currentPage: 5,
				totalPages: 10,
				onPageChange: (_: number) => undefined,
			}}
		/>
	),
};
