import type { Meta, StoryObj } from "@storybook/react";
import { LoadingState } from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
	title: "Molecules/LoadingState",
	component: LoadingState,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {
	render: () => <LoadingState />,
};
