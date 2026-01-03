import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading";

const meta: Meta<typeof Heading> = {
	title: "Atoms/Heading",
	component: Heading,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
	render: () => <Heading />,
};
