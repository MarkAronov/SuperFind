import type { Meta, StoryObj } from "@storybook/react";
import { HowItWorksPage } from "./HowItWorksPage";

const meta: Meta<typeof HowItWorksPage> = {
	title: "Pages/HowItWorksPage",
	component: HowItWorksPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof HowItWorksPage>;

export const Default: Story = {
	render: () => <HowItWorksPage />,
};
