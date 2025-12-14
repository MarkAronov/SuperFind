import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchResults } from "./SearchResults";

const meta: Meta<typeof SearchResults> = {
	title: "Organisms/SearchResults",
	component: SearchResults,
	parameters: {
		layout: "padded",
	},
	decorators: [
		(Story) => (
			<div className="max-w-4xl mx-auto">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

export const WithResults: Story = {
	args: {
		data: {
			success: true,
			query: "TypeScript developers",
			timestamp: new Date().toISOString(),
			answer:
				"Based on your search, I found several experienced developers with strong TypeScript and React skills.",
			people: [
				{
					name: "Sarah Chen",
					role: "Senior Frontend Developer",
					location: "San Francisco, CA",
					skills: "TypeScript; React; Next.js; Tailwind CSS",
					experience: 7,
					experience_years: 7,
					description: "Passionate about building great user experiences",
					email: "sarah.chen@example.com",
					relevanceScore: 0.95,
				},
				{
					name: "Marcus Johnson",
					role: "Full Stack Engineer",
					location: "New York, NY",
					skills: "TypeScript; Node.js; React; PostgreSQL",
					experience: 5,
					experience_years: 5,
					description: "Building scalable web applications",
					email: "marcus.j@example.com",
					relevanceScore: 0.89,
				},
				{
					name: "Emily Rodriguez",
					role: "Frontend Engineer",
					location: "Austin, TX",
					skills: "JavaScript; React; Vue.js; CSS",
					experience: 4,
					experience_years: 4,
					description: "Creative problem solver",
					email: "emily.r@example.com",
					relevanceScore: 0.82,
				},
			],
			sources: [],
		},
		isLoading: false,
	},
};

export const Loading: Story = {
	args: {
		data: {
			success: true,
			query: "Loading...",
			timestamp: new Date().toISOString(),
			people: [],
			sources: [],
		},
		isLoading: true,
	},
};

export const NoResults: Story = {
	args: {
		data: {
			success: true,
			query: "obscure skill no one has",
			timestamp: new Date().toISOString(),
			people: [],
			sources: [],
		},
		isLoading: false,
	},
};

export const WithError: Story = {
	args: {
		data: {
			success: false,
			query: "test query",
			timestamp: new Date().toISOString(),
			error: "Failed to connect to the search service",
			details:
				"Please check your network connection and try again. If the problem persists, contact support.",
			people: [],
			sources: [],
		},
		isLoading: false,
	},
};

export const WithAnswerOnly: Story = {
	args: {
		data: {
			success: true,
			query: "cloud architects",
			timestamp: new Date().toISOString(),
			answer:
				"I found several candidates matching your criteria. The top matches are developers with experience in cloud technologies and distributed systems.",
			people: [
				{
					name: "David Kim",
					role: "Cloud Architect",
					location: "Seattle, WA",
					skills: "AWS; Kubernetes; Terraform; Python",
					experience: 8,
					experience_years: 8,
					description: "Expert in cloud infrastructure",
					email: "d.kim@example.com",
					relevanceScore: 0.91,
				},
			],
			sources: [],
		},
		isLoading: false,
	},
};

export const NonClickableList: Story = {
	args: {
		data: {
			success: true,
			query: "TypeScript developers",
			timestamp: new Date().toISOString(),
			answer: "Top matches for TypeScript developers",
			people: [
				{
					name: "Sarah Chen",
					role: "Senior Frontend Developer",
					location: "San Francisco, CA",
					skills: "TypeScript; React; Next.js; Tailwind CSS",
					experience: 7,
					experience_years: 7,
					description: "Passionate about building great user experiences",
					email: "sarah.chen@example.com",
					relevanceScore: 0.95,
				},
			],
			sources: [],
		},
		isLoading: false,
	},
	parameters: {
		docs: {
			storyDescription:
				"A list of result cards where the cards are static and do not navigate on click.",
		},
	},
};
