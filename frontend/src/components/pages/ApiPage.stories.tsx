import type { Meta, StoryObj } from "@storybook/react";
import { ApiPage } from "./ApiPage";

const meta: Meta<typeof ApiPage> = {
	title: "Pages/ApiPage",
	component: ApiPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ApiPage>;

export const Default: Story = {
	render: () => <ApiPage />,
};
