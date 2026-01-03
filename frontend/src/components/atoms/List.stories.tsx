import type { Meta, StoryObj } from "@storybook/react";
import { List } from "./List";

const meta: Meta<typeof List> = {
	title: "Atoms/List",
	component: List,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {
	render: () => <List />,
};
