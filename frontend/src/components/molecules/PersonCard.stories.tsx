import type { Meta, StoryObj } from "@storybook/react";
import type { PersonSearchResult } from "@/types/search.types";
import { PersonCard } from "./PersonCard";

const meta: Meta<typeof PersonCard> = {
	title: "Molecules/PersonCard",
	component: PersonCard,
};

export default meta;
type Story = StoryObj<typeof PersonCard>;

const mockPerson: PersonSearchResult = {
	id: "1",
	person: {
		name: "Jane Doe",
		role: "Senior Software Engineer",
		location: "San Francisco, CA",
		experience: "8 years",
		experience_years: 8,
		skills: ["React", "TypeScript", "Node.js", "GraphQL"],
		email: "jane.doe@example.com",
		description:
			"Experienced full-stack developer with a passion for building scalable web applications.",
		bio: "Experienced full-stack developer with a passion for building scalable web applications.",
	},
	score: 0.95,
};

const mockPersonStringSkills: PersonSearchResult = {
	id: "2",
	person: {
		name: "John Smith",
		role: "Product Manager",
		location: "New York, NY",
		experience: "5 years",
		experience_years: 5,
		skills: "Product Strategy, Agile, User Research, Jira",
		email: "john.smith@example.com",
		description: "Product manager with expertise in agile methodologies.",
	},
	score: 0.88,
};

export const Default: Story = {
	render: () => (
		<div className="w-full max-w-md p-4">
			<PersonCard person={mockPerson} />
		</div>
	),
};

export const StringSkills: Story = {
	render: () => (
		<div className="w-full max-w-md p-4">
			<PersonCard person={mockPersonStringSkills} />
		</div>
	),
};
