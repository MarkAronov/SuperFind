import type { Meta, StoryObj } from "@storybook/react";
import { ErrorMessage } from "./ErrorMessage";

const meta: Meta<typeof ErrorMessage> = {
	title: "Molecules/ErrorMessage",
	component: ErrorMessage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
	render: () => <ErrorMessage message="An error occurred" />,
};
