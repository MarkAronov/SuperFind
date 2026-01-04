import type { Meta, StoryObj } from "@storybook/react";
import { CTACard } from "./CTACard";

const meta: Meta<typeof CTACard> = {
	title: "Molecules/CTACard",
	component: CTACard,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof CTACard>;

export const Default: Story = {
	render: () => (
		<CTACard title="Get Started" description="Start using SkillVector today" />
	),
};
