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
	render: () => <PersonCard />,
};
