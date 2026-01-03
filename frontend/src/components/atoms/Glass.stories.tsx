import type { Meta, StoryObj } from "@storybook/react";
import { Glass } from "./Glass";

const meta: Meta<typeof Glass> = {
	title: "Atoms/Glass",
	component: Glass,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Glass>;

export const Default: Story = {
	render: () => <Glass />,
};
