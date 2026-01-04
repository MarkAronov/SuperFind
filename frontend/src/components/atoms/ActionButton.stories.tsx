import type { Meta, StoryObj } from "@storybook/react";
import { ActionButton } from "./ActionButton";

const meta: Meta<typeof ActionButton> = {
	title: "Atoms/ActionButton",
	component: ActionButton,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Default: Story = {
	render: () => <ActionButton>Click Me</ActionButton>,
};
