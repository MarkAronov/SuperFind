import type { Meta, StoryObj } from "@storybook/react";
import { ApiDocsPage } from "./ApiDocsPage";

const meta: Meta<typeof ApiDocsPage> = {
	title: "Pages/ApiDocsPage",
	component: ApiDocsPage,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof ApiDocsPage>;

export const Default: Story = {
	render: () => <ApiDocsPage />,
};
