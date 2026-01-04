import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
	title: "Atoms/Table",
	component: Table,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
	render: () => <Table />,
};
