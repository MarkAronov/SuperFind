import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
	title: "Atoms/Text",
	component: Text,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
	render: () => <Text />,
};
