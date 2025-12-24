import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageContainer } from "./PageContainer";

const meta: Meta<typeof PageContainer> = {
	title: "Atoms/PageContainer",
	component: PageContainer,
	parameters: {
		layout: "padded",
	},
};

export default meta;

type Story = StoryObj<typeof PageContainer>;

export const Default: Story = {
	args: {
		children: (
			<div className="bg-muted p-4 rounded">
				<p>This content is constrained to a max width and centered.</p>
			</div>
		),
	},
};
