import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./Grid";

const meta: Meta<typeof Grid> = {
	title: "Atoms/Grid",
	component: Grid,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
	render: () => <Grid />,
};
