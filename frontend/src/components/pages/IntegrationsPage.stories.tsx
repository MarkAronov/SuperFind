import type { Meta, StoryObj } from "@storybook/react";
import { IntegrationsPage } from "./IntegrationsPage";

const meta: Meta<typeof IntegrationsPage> = {
	title: "Pages/IntegrationsPage",
	component: IntegrationsPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof IntegrationsPage>;

export const Default: Story = {
	render: () => <IntegrationsPage />,
};
