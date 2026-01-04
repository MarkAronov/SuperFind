import type { Meta, StoryObj } from "@storybook/react";
import { CookiesPage } from "./CookiesPage";

const meta: Meta<typeof CookiesPage> = {
	title: "Pages/CookiesPage",
	component: CookiesPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof CookiesPage>;

export const Default: Story = {
	render: () => <CookiesPage />,
};
