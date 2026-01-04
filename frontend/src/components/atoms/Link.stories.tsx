import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
	title: "Atoms/Link",
	component: Link,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
	render: () => <Link />,
};
