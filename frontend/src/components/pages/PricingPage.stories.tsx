import type { Meta, StoryObj } from "@storybook/react";
import { PricingPage } from "./PricingPage";

const meta: Meta<typeof PricingPage> = {
	title: "Pages/PricingPage",
	component: PricingPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof PricingPage>;

export const Default: Story = {
	render: () => <PricingPage />,
};
