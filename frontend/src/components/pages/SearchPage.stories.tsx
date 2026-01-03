import type { Meta, StoryObj } from "@storybook/react";
import { SearchPage } from "./SearchPage";

const meta: Meta<typeof SearchPage> = {
	title: "Pages/SearchPage",
	component: SearchPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof SearchPage>;

export const Default: Story = {
	render: () => <SearchPage />,
};
