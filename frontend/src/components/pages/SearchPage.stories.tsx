import type { Meta, StoryObj } from "@storybook/react";
import { SearchPage } from "./SearchPage";

// Note: SearchPage uses router hooks (useNavigate, useSearch)
// The Storybook preview provides a router context with "/" route
const meta: Meta<typeof SearchPage> = {
	title: "Pages/SearchPage",
	component: SearchPage,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof SearchPage>;

export const Default: Story = {
	render: () => <SearchPage />,
};
