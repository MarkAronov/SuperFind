import type { Meta, StoryObj } from "@storybook/react";
import { FeaturesPage } from "./FeaturesPage";

const meta: Meta<typeof FeaturesPage> = {
	title: "Pages/FeaturesPage",
	component: FeaturesPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof FeaturesPage>;

export const Default: Story = {
	render: () => <FeaturesPage />,
};
