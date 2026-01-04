import type { Meta, StoryObj } from "@storybook/react";
import { ViewToggle } from "./ViewToggle";

const meta: Meta<typeof ViewToggle> = {
	title: "Molecules/ViewToggle",
	component: ViewToggle,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ViewToggle>;

export const Default: Story = {
	render: () => <ViewToggle view="grid" onViewChange={() => {}} />,
};
