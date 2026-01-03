import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
	title: "Atoms/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	render: () => <Badge />,
};
