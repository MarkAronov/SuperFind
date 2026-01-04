import type { Meta, StoryObj } from "@storybook/react";
import { BrowsePage } from "./BrowsePage";

const meta: Meta<typeof BrowsePage> = {
	title: "Pages/BrowsePage",
	component: BrowsePage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof BrowsePage>;

export const Default: Story = {
	render: () => <BrowsePage />,
};
