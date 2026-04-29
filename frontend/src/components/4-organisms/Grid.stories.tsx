import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../3-molecules/Card";
import { Grid, GridItem } from "./Grid";

const meta = {
	title: "Organisms/Grid",
	component: Grid,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"A robust, responsive grid layout system for organizing cards. Automatically adapts from 1 column (mobile) to 2 columns (tablet) to 3 columns (desktop).",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample card data for demos
const sampleCards = [
	{
		title: "Feature 1",
		content: "This is the first feature card with some content.",
	},
	{
		title: "Feature 2",
		content: "This is the second feature card with more details.",
	},
	{ title: "Feature 3", content: "This is the third feature card." },
	{
		title: "Feature 4",
		content: "This is the fourth feature card with content.",
	},
	{ title: "Feature 5", content: "This is the fifth feature card." },
	{
		title: "Feature 6",
		content: "This is the sixth feature card with some text.",
	},
];

/**
 * Default 3-column responsive grid that adapts to viewport size.
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 */
export const Default: Story = {
	args: {
		children: sampleCards.map((card) => (
			<Card key={card.title} variant="hover" fill>
				<CardHeader>
					<CardTitle>{card.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{card.content}</p>
				</CardContent>
			</Card>
		)),
	},
};

/**
 * Two-column layout that works well for wider content cards.
 */
export const TwoColumns: Story = {
	args: {
		maxColumns: 2,
		children: sampleCards.slice(0, 4).map((card) => (
			<Card key={card.title} variant="hover" fill>
				<CardHeader>
					<CardTitle>{card.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{card.content}</p>
					<p className="mt-2 text-sm opacity-70">
						Additional content to show how cards stretch to equal heights.
					</p>
				</CardContent>
			</Card>
		)),
	},
};

/**
 * Single column layout for mobile-first or list-style presentations.
 */
export const SingleColumn: Story = {
	args: {
		maxColumns: 1,
		children: sampleCards.slice(0, 3).map((card) => (
			<Card key={card.title} variant="default" fill>
				<CardHeader>
					<CardTitle>{card.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{card.content}</p>
				</CardContent>
			</Card>
		)),
	},
};

/**
 * Small gap between cards for a tighter layout.
 */
export const SmallGap: Story = {
	args: {
		gap: "sm",
		children: sampleCards.map((card) => (
			<Card key={card.title} variant="hover" fill>
				<CardHeader>
					<CardTitle>{card.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{card.content}</p>
				</CardContent>
			</Card>
		)),
	},
};

/**
 * Large gap between cards for more breathing room.
 */
export const LargeGap: Story = {
	args: {
		gap: "lg",
		children: sampleCards.map((card) => (
			<Card key={card.title} variant="feature" fill>
				<CardHeader>
					<CardTitle>{card.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{card.content}</p>
				</CardContent>
			</Card>
		)),
	},
};

/**
 * Extra large gap for maximum spacing.
 */
export const ExtraLargeGap: Story = {
	args: {
		gap: "xl",
		maxColumns: 2,
		children: sampleCards.slice(0, 4).map((card) => (
			<Card key={card.title} variant="feature" fill>
				<CardHeader>
					<CardTitle>{card.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{card.content}</p>
				</CardContent>
			</Card>
		)),
	},
};

/**
 * Cards with varying content heights demonstrate auto-stretching behavior.
 */
export const UnequalHeights: Story = {
	args: {
		children: [
			<Card key={1} variant="hover" fill>
				<CardHeader>
					<CardTitle>Short Card</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Brief content.</p>
				</CardContent>
			</Card>,
			<Card key={2} variant="hover" fill>
				<CardHeader>
					<CardTitle>Medium Card</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						This card has a bit more content to demonstrate the auto-stretching
						behavior.
					</p>
				</CardContent>
			</Card>,
			<Card key={3} variant="hover" fill>
				<CardHeader>
					<CardTitle>Tall Card</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						This card has significantly more content to show how all cards in
						the same row stretch to match the tallest card's height. This
						creates a clean, uniform grid layout.
					</p>
					<p className="mt-2">Additional paragraph to increase height.</p>
					<p className="mt-2">And another one for good measure.</p>
				</CardContent>
			</Card>,
			<Card key={4} variant="hover" fill>
				<CardHeader>
					<CardTitle>Another Short Card</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Minimal text here.</p>
				</CardContent>
			</Card>,
			<Card key={5} variant="hover" fill>
				<CardHeader>
					<CardTitle>Medium Again</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Some content in the middle range.</p>
				</CardContent>
			</Card>,
			<Card key={6} variant="hover" fill>
				<CardHeader>
					<CardTitle>Variable Height</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Content can vary, and the grid handles it gracefully.</p>
				</CardContent>
			</Card>,
		],
	},
};

/**
 * Using GridItem for advanced layouts with column spanning.
 */
export const WithGridItems: Story = {
	args: {
		as: "ul",
		children: [
			<GridItem key={1} as="li" colSpan={2}>
				<Card variant="feature" fill>
					<CardHeader>
						<CardTitle>Featured Card (Spans 2 Columns)</CardTitle>
					</CardHeader>
					<CardContent>
						<p>This card spans 2 columns on tablet and larger screens.</p>
					</CardContent>
				</Card>
			</GridItem>,
			<GridItem key={2} as="li">
				<Card variant="hover" fill>
					<CardHeader>
						<CardTitle>Regular Card</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Standard single-column card.</p>
					</CardContent>
				</Card>
			</GridItem>,
			<GridItem key={3} as="li">
				<Card variant="hover" fill>
					<CardHeader>
						<CardTitle>Another Card</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Another standard card.</p>
					</CardContent>
				</Card>
			</GridItem>,
			<GridItem key={4} as="li">
				<Card variant="hover" fill>
					<CardHeader>
						<CardTitle>More Content</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Additional card content.</p>
					</CardContent>
				</Card>
			</GridItem>,
			<GridItem key={5} as="li">
				<Card variant="hover" fill>
					<CardHeader>
						<CardTitle>Final Card</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Last card in the grid.</p>
					</CardContent>
				</Card>
			</GridItem>,
		],
	},
};

/**
 * Semantic list structure using ul/li elements for better accessibility.
 */
export const SemanticList: Story = {
	args: {
		as: "ul",
		children: sampleCards.map((card) => (
			<li key={card.title}>
				<Card variant="hover" fill>
					<CardHeader>
						<CardTitle>{card.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{card.content}</p>
					</CardContent>
				</Card>
			</li>
		)),
	},
};

/**
 * Cards without auto-stretching to see natural heights.
 */
export const NoStretch: Story = {
	args: {
		stretchCards: false,
		children: [
			<Card key={1} variant="hover">
				<CardHeader>
					<CardTitle>Short</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Brief.</p>
				</CardContent>
			</Card>,
			<Card key={2} variant="hover">
				<CardHeader>
					<CardTitle>Medium</CardTitle>
				</CardHeader>
				<CardContent>
					<p>This has more content.</p>
					<p>Multiple paragraphs.</p>
				</CardContent>
			</Card>,
			<Card key={3} variant="hover">
				<CardHeader>
					<CardTitle>Tall</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Lots of content here.</p>
					<p>Additional paragraphs.</p>
					<p>Even more text.</p>
					<p>And another line.</p>
				</CardContent>
			</Card>,
		],
	},
};
