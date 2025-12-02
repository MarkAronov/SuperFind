import type { Meta, StoryObj } from "@storybook/react";
import { SupportPage } from "./SupportPage";

const meta: Meta<typeof SupportPage> = {
	title: "Pages/SupportPage",
	component: SupportPage,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof SupportPage>;

export const Default: Story = {
	render: () => <SupportPage />,
};
