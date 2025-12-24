import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "./Hero";

const meta: Meta<typeof Hero> = {
	title: "Atoms/Hero",
	component: Hero,
	parameters: {
		layout: "padded",
	},
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
	args: {
		title: "Welcome to",
		brand: "SkillVector",
		subtitle:
			"The future of talent search powered by AI and vector technology.",
	},
};

export const NoBrand: Story = {
	args: {
		title: "About Our Company",
		subtitle: "Learn more about our mission and values.",
	},
};
