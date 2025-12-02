import type { Meta, StoryObj } from "@storybook/react";
import { ApiPage } from "./ApiPage";

const meta: Meta<typeof ApiPage> = {
	title: "Pages/ApiPage",
	component: ApiPage,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof ApiPage>;

export const Default: Story = {
	render: () => (
		<div style={{ padding: 20, maxWidth: 1200 }}>
			<ApiPage />
		</div>
	),
};
