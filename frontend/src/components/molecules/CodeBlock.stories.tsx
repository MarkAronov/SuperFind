import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";

const meta: Meta<typeof CodeBlock> = {
	title: "Molecules/CodeBlock",
	component: CodeBlock,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {
	render: () => (
		<CodeBlock language="typescript" code="console.log('Hello, World!');" />
	),
};
