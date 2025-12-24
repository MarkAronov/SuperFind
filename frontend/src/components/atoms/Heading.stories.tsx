import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";

const meta: Meta<typeof Heading> = {
	title: "Atoms/Heading",
	component: Heading,
	parameters: {
		layout: "padded",
	},
	argTypes: {
		as: {
			control: { type: "select" },
			options: ["h1", "h2", "h3", "h4", "h5", "h6"],
		},
		variant: {
			control: { type: "select" },
			options: ["hero", "section", "subsection", "card"],
		},
	},
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Hero: Story = {
	args: {
		variant: "hero",
		children: "Hero Heading",
	},
};

export const Section: Story = {
	args: {
		variant: "section",
		children: "Section Heading",
	},
};

export const Subsection: Story = {
	args: {
		variant: "subsection",
		children: "Subsection Heading",
	},
};

export const Card: Story = {
	args: {
		variant: "card",
		children: "Card Heading",
	},
};

export const CustomAs: Story = {
	args: {
		as: "h3",
		variant: "section",
		children: "Custom Element Heading",
	},
};
