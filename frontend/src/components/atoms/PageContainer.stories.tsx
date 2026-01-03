import type { Meta, StoryObj } from "@storybook/react";
import { PageContainer } from "./PageContainer";

const meta: Meta<typeof PageContainer> = {
	title: "Atoms/PageContainer",
	component: PageContainer,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof PageContainer>;

export const Default: Story = {
	render: () => <PageContainer />,
};
