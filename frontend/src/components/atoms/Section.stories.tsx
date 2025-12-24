import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "./Section";

const meta: Meta<typeof Section> = {
	title: "Atoms/Section",
	component: Section,
	parameters: {
		layout: "padded",
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "hero", "spaced", "compact"],
		},
	},
};

export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {
	args: {
		children: <p>This is a default section.</p>,
	},
};

export const Hero: Story = {
	args: {
		variant: "hero",
		children: (
			<p>This is a hero section with centered text and bottom margin.</p>
		),
	},
};

export const Spaced: Story = {
	args: {
		variant: "spaced",
		children: <p>This is a spaced section with larger margins.</p>,
	},
};

export const Compact: Story = {
	args: {
		variant: "compact",
		children: <p>This is a compact section with smaller margins.</p>,
	},
};
