import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "./Card";
import type { CTACardProps } from "./CTACard.types";

/**
 * CTACard Component (Call-to-Action Card)
 *
 * Centered card component designed to encourage user action.
 * Combines heading, description, and up to two action buttons.
 *
 * Structure:
 * - Title: Section heading (prominent)
 * - Description: Lead text (descriptive, explanatory)
 * - Actions: Primary and/or secondary buttons (flexible layout)
 *
 * Action Buttons:
 * - primaryAction: Main CTA (default: primary variant)
 * - secondaryAction: Alternative action (default: outline variant)
 * - Both support onClick, href, to (router), external links
 *
 * Layout:
 * - Centered content (text-center)
 * - Hover variant card for interactivity
 * - Flexbox action buttons with gap spacing
 * - Wraps buttons on narrow screens
 *
 * Use Cases:
 * - Newsletter signups
 * - Feature promotions
 * - Download/trial offers
 * - Getting started prompts
 */

export const CTACard = ({
	title,
	description,
	primaryAction,
	secondaryAction,
	className = "",
	"aria-label": ariaLabel,
}: CTACardProps) => {
	return (
		<Card variant="hover" aria-label={ariaLabel || title} className={className}>
			<CardContent centered>
				<Heading variant="section" className="mb-4">
					{title}
				</Heading>
				<Text variant="lead" className="mb-6">
					{description}
				</Text>
				{/* Action buttons container */}
				{(primaryAction || secondaryAction) && (
					<Div
						className={cn(
							// Layout
							"flex justify-center flex-wrap",
							// Spacing
							SPACING.GAP.md,
						)}
					>
						{primaryAction &&
							(primaryAction.to || primaryAction.href ? (
								<Button
									variant={primaryAction.variant || "default"}
									aria-label={primaryAction.ariaLabel}
									asChild
								>
									<Link
										to={primaryAction.to}
										href={primaryAction.href}
										external={primaryAction.external}
									>
										{primaryAction.label}
									</Link>
								</Button>
							) : (
								<Button
									onClick={primaryAction.onClick}
									variant={primaryAction.variant || "default"}
									aria-label={primaryAction.ariaLabel}
								>
									{primaryAction.label}
								</Button>
							))}
						{secondaryAction &&
							(secondaryAction.to || secondaryAction.href ? (
								<Button
									variant={secondaryAction.variant || "outline"}
									aria-label={secondaryAction.ariaLabel}
									asChild
								>
									<Link
										to={secondaryAction.to}
										href={secondaryAction.href}
										external={secondaryAction.external}
									>
										{secondaryAction.label}
									</Link>
								</Button>
							) : (
								<Button
									onClick={secondaryAction.onClick}
									variant={secondaryAction.variant || "outline"}
									aria-label={secondaryAction.ariaLabel}
								>
									{secondaryAction.label}
								</Button>
							))}
					</Div>
				)}
			</CardContent>
		</Card>
	);
};
