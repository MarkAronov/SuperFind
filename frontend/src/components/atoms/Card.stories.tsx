import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code, Search, Zap } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./Card";

const meta: Meta<typeof Card> = {
	title: "Atoms/Card",
	component: Card,
	parameters: {
		layout: "padded",
	},
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
	render: () => (
		<Card className="p-6 max-w-sm">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card description goes here</CardDescription>
			</CardHeader>
			<CardContent>Card content goes here</CardContent>
		</Card>
	),
};

export const FeatureCard: Story = {
	render: () => (
		<Card className="p-6 hover:shadow-lg transition-shadow max-w-sm">
			<div className="mb-4 text-primary">
				<Search className="h-6 w-6" />
			</div>
			<h3 className="text-xl font-semibold mb-2">Semantic Search</h3>
			<p className="text-muted-foreground">
				Find talent based on meaning, not just keywords. Our AI understands
				context and intent.
			</p>
		</Card>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Card className="p-6 max-w-sm">
			<CardHeader>
				<CardTitle>Feature Card</CardTitle>
				<CardDescription>A card with a footer action</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">
					This card includes a footer with action buttons.
				</p>
			</CardContent>
			<CardFooter>
				<button
					type="button"
					className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
				>
					Learn More
				</button>
			</CardFooter>
		</Card>
	),
};

export const FeatureGrid: Story = {
	render: () => (
		<ul className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
			{[
				{
					icon: <Search className="h-6 w-6" />,
					title: "Semantic Search",
					description: "Find talent based on meaning, not just keywords.",
				},
				{
					icon: <Zap className="h-6 w-6" />,
					title: "Lightning Fast",
					description: "Built on Bun runtime for sub-second results.",
				},
				{
					icon: <Code className="h-6 w-6" />,
					title: "Multi-AI Provider",
					description: "Choose from OpenAI, Anthropic, Gemini, and more.",
				},
			].map((feature) => (
				<li key={feature.title}>
					<Card
						aria-label={feature.title}
						className="p-6 hover:shadow-lg transition-shadow h-full"
					>
						<div className="mb-4 text-primary">{feature.icon}</div>
						<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
						<p className="text-muted-foreground">{feature.description}</p>
					</Card>
				</li>
			))}
		</ul>
	),
};
