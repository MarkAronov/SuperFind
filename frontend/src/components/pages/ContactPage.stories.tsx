import type { Meta, StoryObj } from "@storybook/react";
import { ContactPage } from "./ContactPage";

const meta: Meta<typeof ContactPage> = {
	title: "Pages/ContactPage",
	component: ContactPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ContactPage>;

export const Default: Story = {
	render: () => <ContactPage />,
};
