import type { Meta, StoryObj } from "@storybook/react";
import { ChangelogPage } from "./ChangelogPage";

const meta: Meta<typeof ChangelogPage> = {
	title: "Pages/ChangelogPage",
	component: ChangelogPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ChangelogPage>;

export const Default: Story = {
	render: () => <ChangelogPage />,
};
