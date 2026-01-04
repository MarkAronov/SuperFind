import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
	title: "Atoms/StatusBadge",
	component: StatusBadge,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {
	render: () => <StatusBadge status="ready" />,
};
