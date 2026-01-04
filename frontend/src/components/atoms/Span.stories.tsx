import type { Meta, StoryObj } from "@storybook/react";
import { Span } from "./Span";

const meta: Meta<typeof Span> = {
	title: "Atoms/Span",
	component: Span,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Span>;

export const Default: Story = {
	render: () => <Span />,
};
