import type { Meta, StoryObj } from "@storybook/react";
import { PersonCard } from "./PersonCard";

const meta: Meta<typeof PersonCard> = {
	title: "Molecules/PersonCard",
	component: PersonCard,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof PersonCard>;

export const Default: Story = {
	render: () => (
		<PersonCard
			person={{
				id: "1",
				score: 0.95,
				person: {
					name: "John Doe",
					role: "Software Engineer",
					location: "San Francisco, CA",
					skills: ["TypeScript", "React"],
					experience: "5 years",
					email: "john@example.com",
				},
			}}
		/>
	),
};
