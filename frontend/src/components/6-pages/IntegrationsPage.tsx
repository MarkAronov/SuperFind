import { useNavigate } from "@tanstack/react-router";
import { FileText, Github, SquareArrowOutUpRight } from "lucide-react";
import { EXTERNAL_LINKS, SOCIAL_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { Section } from "../2-atoms/Section";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "../3-molecules/Card";
import { Hero } from "../3-molecules/Hero";
import { StatusBadge } from "../3-molecules/StatusBadge";
import { Grid } from "../4-organisms/Grid";
import { PageTemplate } from "../5-templates/PageTemplate";
import { categories } from "./IntegrationsPage.data.tsx";
import type { Integration } from "./IntegrationsPage.types";

/**
 * IntegrationCard Component
 *
 * Individual card for a single integration. Displays:
 * - Icon + Title (top row)
 * - Description (middle)
 * - Status badge + action links (bottom row)
 *
 * Professional card-based layout inspired by Vercel/GitHub integrations pages.
 */
const IntegrationCard = ({ integration }: { integration: Integration }) => {
	// Extract action links for cleaner template
	const actions = {
		internal: integration.links?.internal,
		docs: integration.links?.docs,
		github: integration.links?.github,
	};

	// Check if any action links exist
	const hasActions = actions.internal || actions.docs || actions.github;

	return (
		<Card fill aria-label={integration.title}>
			<CardContent
				className={cn(
					// Override card padding — roomy but not excessive
					"!p-6 !lg:p-8",
					// Layout - vertical stack with space between content and footer
					"justify-between",
				)}
			>
				{/* Top Section — Icon, title, and description */}
				<Div className="flex flex-col">
					{/* Icon + Title row */}
					<Div
						variant="flex"
						className={cn(
							// Layout
							"items-center",
							// Spacing — comfortable gap between icon and title
							SPACING.GAP.md,
							"mb-3",
						)}
					>
						{/* Integration icon — accent colored, 24px */}
						<Div className="text-primary shrink-0">{integration.icon}</Div>

						{/* Integration name — prominent heading */}
						<Heading
							as="h4"
							className={cn(
								// Typography — slightly larger for readability
								TYPOGRAPHY.FONT_SIZE.lg,
								TYPOGRAPHY.FONT_WEIGHT.semibold,
							)}
						>
							{integration.title}
						</Heading>
					</Div>

					{/* Description text */}
					<Text variant="muted" className="mb-5">
						{integration.description}
					</Text>
				</Div>

				{/* Bottom Section — Status badge + action icon buttons */}
				<Div
					className={cn(
						// Layout — spread status and actions to opposite sides
						"flex items-center justify-between",
						"pt-4",
					)}
				>
					{/* Status badge (ready / coming soon / planned) */}
					<StatusBadge status={integration.status} />

					{/* Action icon buttons — docs, github, internal links */}
					{hasActions && (
						<Div
							className={cn(
								// Layout
								"flex items-center",
								// Spacing — comfortable gap between action buttons
								SPACING.GAP.sm,
							)}
						>
							{/* Internal link — opens in-app route */}
							{actions.internal && (
								<Button
									asChild
									size="icon-sm"
									variant="ghost"
									aria-label={`Open ${integration.title}`}
								>
									<Link to={actions.internal}>
										{/* Open icon — 16px */}
										<SquareArrowOutUpRight className={SIZING.ICON.sm} />
									</Link>
								</Button>
							)}

							{/* Documentation link — opens external docs */}
							{actions.docs && (
								<Button
									asChild
									size="icon-sm"
									variant="ghost"
									aria-label={`${integration.title} Documentation`}
								>
									<Link href={actions.docs} external>
										{/* Docs icon — 16px */}
										<FileText className={SIZING.ICON.sm} />
									</Link>
								</Button>
							)}

							{/* GitHub link — opens repository */}
							{actions.github && (
								<Button
									asChild
									size="icon-sm"
									variant="ghost"
									aria-label={`${integration.title} GitHub`}
								>
									<Link href={actions.github} external>
										{/* GitHub icon — 16px */}
										<Github className={SIZING.ICON.sm} />
									</Link>
								</Button>
							)}
						</Div>
					)}
				</Div>
			</CardContent>
		</Card>
	);
};

/**
 * IntegrationsPage
 *
 * Professional card-based integrations showcase.
 * Each category is a section with a header, followed by a responsive grid
 * of individual integration cards.
 *
 * Layout pattern inspired by Vercel, GitHub, and Slack integrations pages:
 * - Category header (icon + title + description)
 * - Responsive card grid (2-3 columns) of individual integrations
 * - Each card shows icon, title, description, status, and action links
 */
export const IntegrationsPage = () => {
	useNavigate();
	return (
		<PageTemplate title="Integrations">
			{/* Hero Section */}
			<Hero title="" brand="Integrations" subtitle="" />

			{/* Integration Categories — each category is a section with card grid */}
			{categories.map((category) => (
				<Section key={category.title}>
					{/* Category Header — icon + title + description */}
					<Div
						variant="flex"
						className={cn(
							// Layout
							"items-start",
							// Spacing
							SPACING.GAP.md,
							"mb-6",
						)}
					>
						{/* Category icon — accent colored */}
						<Div className="text-primary shrink-0">{category.icon}</Div>

						{/* Category title and description */}
						<Div className="min-w-0">
							<Heading variant="card" className="mb-1">
								{category.title}
							</Heading>
							<Text variant="muted">{category.description}</Text>
						</Div>
					</Div>

					{/* Integration Cards Grid — responsive 2-3 column layout */}
					<Grid maxColumns={3} centerIncompleteRows>
						{category.integrations.map((integration) => (
							<IntegrationCard
								key={integration.title}
								integration={integration}
							/>
						))}
					</Grid>
				</Section>
			))}

			{/* CTA Section — Request custom integration */}
			<Card variant="hover" aria-label="Request custom integration">
				<CardContent centered>
					<Heading variant="section" className="mb-4">
						Need a Custom Integration?
					</Heading>
					<Text variant="lead" className="mb-6">
						SkillVector is open source and extensible. Build your own or request
						new integrations.
					</Text>
					<Div
						className={cn(
							// Layout
							"flex justify-center flex-wrap",
							// Spacing
							SPACING.GAP.md,
						)}
					>
						<Button asChild aria-label="View SkillVector on GitHub">
							<Link href={SOCIAL_LINKS.github} external>
								View on GitHub
							</Link>
						</Button>
						<Button
							asChild
							variant="secondary"
							aria-label="Request new integration"
						>
							<Link href={EXTERNAL_LINKS.discussions} external>
								Request Integration
							</Link>
						</Button>
					</Div>
				</CardContent>
			</Card>
		</PageTemplate>
	);
};
