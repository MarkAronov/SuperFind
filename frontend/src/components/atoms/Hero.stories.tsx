import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "./Hero";

const meta: Meta<typeof Hero> = {
	title: "Atoms/Hero",
	component: Hero,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
	render: () => <Hero title="Welcome" subtitle="This is a hero component" />,
};
