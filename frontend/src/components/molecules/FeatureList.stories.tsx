import type { Meta, StoryObj } from "@storybook/react";
import { FeatureList } from "./FeatureList";

const meta: Meta<typeof FeatureList> = {
	title: "Molecules/FeatureList",
	component: FeatureList,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof FeatureList>;

export const Default: Story = {
	render: () => (
		<FeatureList features={["Feature 1", "Feature 2", "Feature 3"]} />
	),
};
