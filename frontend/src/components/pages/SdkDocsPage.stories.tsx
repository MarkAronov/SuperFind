import type { Meta, StoryObj } from "@storybook/react";
import { SdkDocsPage } from "./SdkDocsPage";

const meta: Meta<typeof SdkDocsPage> = {
	title: "Pages/SdkDocsPage",
	component: SdkDocsPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof SdkDocsPage>;

export const Default: Story = {
	render: () => <SdkDocsPage />,
};
