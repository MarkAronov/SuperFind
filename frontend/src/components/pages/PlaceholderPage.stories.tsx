import type { Meta, StoryObj } from "@storybook/react";
import { PlaceholderPage } from "./PlaceholderPage";

const meta: Meta<typeof PlaceholderPage> = {
	title: "Pages/PlaceholderPage",
	component: PlaceholderPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof PlaceholderPage>;

export const Default: Story = {
	render: () => <PlaceholderPage title="Placeholder" />,
};
