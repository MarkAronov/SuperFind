import type { Meta, StoryObj } from "@storybook/react";
import { Section } from "./Section";

const meta: Meta<typeof Section> = {
	title: "Atoms/Section",
	component: Section,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
	render: () => <Section />,
};
