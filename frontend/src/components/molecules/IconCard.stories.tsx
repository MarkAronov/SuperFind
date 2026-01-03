import type { Meta, StoryObj } from "@storybook/react";
import { IconCard } from "./IconCard";

const meta: Meta<typeof IconCard> = {
	title: "Molecules/IconCard",
	component: IconCard,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof IconCard>;

export const Default: Story = {
	render: () => <IconCard />,
};
