import type { Meta, StoryObj } from "@storybook/react";
import { PrivacyPage } from "./PrivacyPage";

const meta: Meta<typeof PrivacyPage> = {
	title: "Pages/PrivacyPage",
	component: PrivacyPage,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof PrivacyPage>;

export const Default: Story = {
	render: () => <PrivacyPage />,
};
