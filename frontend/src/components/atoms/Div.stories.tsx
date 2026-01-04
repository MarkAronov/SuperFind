import type { Meta, StoryObj } from "@storybook/react";
import { Div } from "./Div";

const meta: Meta<typeof Div> = {
	title: "Atoms/Div",
	component: Div,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Div>;

export const Default: Story = {
	render: () => <Div />,
};
