import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardSection } from "./CardSection";

const meta: Meta<typeof CardSection> = {
	title: "Atoms/CardSection",
	component: CardSection,
	parameters: {
		layout: "padded",
	},
};

export default meta;

type Story = StoryObj<typeof CardSection>;

export const Default: Story = {
	args: {
		children: (
			<>
				<h3>Card Title</h3>
				<p>This is content inside a card section with hover effects.</p>
			</>
		),
	},
};

export const WithAriaLabel: Story = {
	args: {
		"aria-label": "Example Card",
		children: (
			<>
				<h3>Accessible Card</h3>
				<p>This card has proper accessibility attributes.</p>
			</>
		),
	},
};
