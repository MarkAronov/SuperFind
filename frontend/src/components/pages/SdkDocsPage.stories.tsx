import type { Meta, StoryObj } from "@storybook/react";
import { SdkDocsPage } from "./SdkDocsPage";

const meta: Meta<typeof SdkDocsPage> = {
	title: "Pages/SDK Docs",
	component: SdkDocsPage,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof SdkDocsPage>;

export const Default: Story = {
	render: () => <SdkDocsPage />,
};
