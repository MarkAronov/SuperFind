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
	score: 0.45,
};

const mockPersonLow: PersonSearchResult = {
	id: "3",
	person: {
		name: "Sam Low",
		role: "Junior Dev",
		location: "Austin, TX",
		experience: "1 year",
		experience_years: 1,
		skills: "HTML; CSS",
		email: "sam.low@example.com",
		description: "Early career developer",
	},
	score: 0.12,
};

const mockPersonMid: PersonSearchResult = {
	id: "4",
	person: {
		name: "Alex Mid",
		role: "Engineer",
		location: "Berlin, Germany",
		experience: "4 years",
		experience_years: 4,
		skills: ["React", "TypeScript"],
		email: "alex.mid@example.com",
		description: "Mid-level engineer",
	},
	score: 0.5,
};

const mockPersonHigh: PersonSearchResult = {
	id: "5",
	person: {
		name: "Pat High",
		role: "Senior Engineer",
		location: "Toronto, Canada",
		experience: "10 years",
		experience_years: 10,
		skills: ["Systems", "Architecture"],
		email: "pat.high@example.com",
		description: "Seasoned architect",
	},
	score: 0.92,
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

export const NonClickable: Story = {
	render: () => (
		<div className="w-full max-w-md p-4">
			<PersonCard person={mockPerson} />
		</div>
	),
	parameters: {
		docs: {
			storyDescription:
				"Person cards are no longer clickable — they are static cards. Click behavior was removed to avoid accidental navigation.",
		},
	},
};

export const GridView: Story = {
	render: () => (
		<div className="w-full">
			<div className="grid gap-4 md:grid-cols-2">
				<PersonCard person={mockPerson} view="grid" />
				<PersonCard person={mockPersonStringSkills} view="grid" />
			</div>
		</div>
	),
};

export const RowView: Story = {
	render: () => (
		<div className="w-full space-y-4">
			<PersonCard person={mockPerson} view="row" />
			<PersonCard person={mockPersonStringSkills} view="row" />
		</div>
	),
};

export const RelevanceLevels: Story = {
	render: () => (
		<div className="w-full space-y-4">
			<PersonCard person={mockPersonLow} view="row" />
			<PersonCard person={mockPersonMid} view="row" />
			<PersonCard person={mockPersonHigh} view="row" />
		</div>
	),
};
