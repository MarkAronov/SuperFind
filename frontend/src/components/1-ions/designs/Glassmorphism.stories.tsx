import type { Meta, StoryObj } from "@storybook/react";
import { Glassmorphism } from "./Glassmorphism";

const meta: Meta<typeof Glassmorphism> = {
	title: "Atoms/Glassmorphism",
	component: Glassmorphism,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Glassmorphism>;

export const Default: Story = {
	render: () => <Glassmorphism />,
};
