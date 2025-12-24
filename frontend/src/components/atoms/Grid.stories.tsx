import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "./Grid";

const meta: Meta<typeof Grid> = {
	title: "Atoms/Grid",
	component: Grid,
	parameters: {
		layout: "padded",
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["features", "cards", "responsive"],
		},
	},
};

export default meta;

type Story = StoryObj<typeof Grid>;

export const Features: Story = {
	args: {
		variant: "features",
		children: (
			<>
				<li>Feature 1</li>
				<li>Feature 2</li>
				<li>Feature 3</li>
				<li>Feature 4</li>
			</>
		),
	},
};

export const Cards: Story = {
	args: {
		variant: "cards",
		children: (
			<>
				<li>Card 1</li>
				<li>Card 2</li>
				<li>Card 3</li>
			</>
		),
	},
};

export const Responsive: Story = {
	args: {
		variant: "responsive",
		children: (
			<>
				<li>Item 1</li>
				<li>Item 2</li>
			</>
		),
	},
};
