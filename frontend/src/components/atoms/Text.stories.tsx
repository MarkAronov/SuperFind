import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
	title: "Atoms/Text",
	component: Text,
	parameters: {
		layout: "padded",
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: [
				"body",
				"lead",
				"muted",
				"small",
				"caption",
				"heading",
				"subheading",
			],
		},
		children: {
			control: "text",
		},
	},
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Body: Story = {
	args: {
		variant: "body",
		children:
			"This is body text with standard styling for paragraphs and general content.",
	},
};

export const Lead: Story = {
	args: {
		variant: "lead",
		children:
			"This is lead text, perfect for introductory paragraphs or important descriptions.",
	},
};

export const Muted: Story = {
	args: {
		variant: "muted",
		children:
			"This is muted text for secondary information or less important content.",
	},
};

export const Small: Story = {
	args: {
		variant: "small",
		children: "This is small text for fine print or additional details.",
	},
};

export const Caption: Story = {
	args: {
		variant: "caption",
		children: "This is caption text for image captions or small annotations.",
	},
};

export const Heading: Story = {
	args: {
		variant: "heading",
		children: "This is heading text for main section titles.",
	},
};

export const Subheading: Story = {
	args: {
		variant: "subheading",
		children: "This is subheading text for subsection titles.",
	},
};
