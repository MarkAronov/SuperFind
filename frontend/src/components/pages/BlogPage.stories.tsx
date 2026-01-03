import type { Meta, StoryObj } from "@storybook/react";
import { BlogPage } from "./BlogPage";

const meta: Meta<typeof BlogPage> = {
	title: "Pages/BlogPage",
	component: BlogPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof BlogPage>;

export const Default: Story = {
	render: () => <BlogPage />,
};
