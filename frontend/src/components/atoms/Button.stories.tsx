import type { Meta, StoryObj } from "@storybook/react";
import { Mail } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	title: "Atoms/Button",
	component: Button,
	parameters: {
		// design: {
		// 	type: "figma",
		// 	url: "https://www.figma.com/file/YOUR_FILE_ID?node-id=XX-XX",
		// },
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	render: () => <Button>Default Button</Button>,
};

export const Secondary: Story = {
	render: () => <Button variant="secondary">Secondary Button</Button>,
};

export const Destructive: Story = {
	render: () => <Button variant="destructive">Destructive Button</Button>,
};

export const Outline: Story = {
	render: () => <Button variant="outline">Outline Button</Button>,
};

export const Ghost: Story = {
	render: () => <Button variant="ghost">Ghost Button</Button>,
};

export const Link: Story = {
	render: () => <Button variant="link">Link Button</Button>,
};

export const WithIcon: Story = {
	render: () => (
		<Button>
			<Mail className="mr-2 h-4 w-4" /> Login with Email
		</Button>
	),
};

export const IconOnly: Story = {
	render: () => (
		<Button variant="outline" size="icon">
			<Mail className="h-4 w-4" />
		</Button>
	),
};
