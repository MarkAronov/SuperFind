import type { Meta, StoryObj } from "@storybook/react-vite";
import { Glass } from "./Glass";

const meta: Meta<typeof Glass> = {
	title: "Atoms/Glass",
	component: Glass,
	parameters: {
		layout: "padded",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "pronounced", "panel", "card"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Glass>;

export const Default: Story = {
	render: () => (
		<Glass variant="default" className="p-6 max-w-md">
			<h3 className="text-lg font-semibold mb-2">Default Glass</h3>
			<p className="text-muted-foreground">
				The default glass variant with subtle backdrop blur effect.
			</p>
		</Glass>
	),
};

export const Pronounced: Story = {
	render: () => (
		<Glass variant="pronounced" className="p-6 max-w-md">
			<h3 className="text-lg font-semibold mb-2">Pronounced Glass</h3>
			<p className="text-muted-foreground">
				A more prominent glass effect for hero sections and highlights.
			</p>
		</Glass>
	),
};

export const Panel: Story = {
	render: () => (
		<Glass
			variant="panel"
			className="p-12 max-w-2xl text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
		>
			<h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
			<p className="text-xl text-muted-foreground mb-6">
				Try SkillVector today and experience the future of talent search.
			</p>
			<div className="flex gap-4 justify-center">
				<button
					type="button"
					className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
				>
					Get Started
				</button>
				<button
					type="button"
					className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white/10 transition-colors font-medium"
				>
					Learn More
				</button>
			</div>
		</Glass>
	),
};

export const CardVariant: Story = {
	render: () => (
		<Glass variant="card" className="p-6 max-w-md">
			<h3 className="text-lg font-semibold mb-2">Card Variant</h3>
			<p className="text-muted-foreground">
				The card variant used as the base for the Card component.
			</p>
		</Glass>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="space-y-6 max-w-md">
			<Glass variant="default" className="p-4">
				<p className="font-medium">Default Variant</p>
			</Glass>
			<Glass variant="pronounced" className="p-4">
				<p className="font-medium">Pronounced Variant</p>
			</Glass>
			<Glass variant="panel" className="p-4">
				<p className="font-medium">Panel Variant</p>
			</Glass>
			<Glass variant="card" className="p-4">
				<p className="font-medium">Card Variant</p>
			</Glass>
		</div>
	),
};
