import type { Meta, StoryObj } from "@storybook/react";
import { TutorialsPage } from "./TutorialsPage";

const meta: Meta<typeof TutorialsPage> = {
	title: "Pages/TutorialsPage",
	component: TutorialsPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof TutorialsPage>;

export const Default: Story = {
	render: () => <TutorialsPage />,
};
