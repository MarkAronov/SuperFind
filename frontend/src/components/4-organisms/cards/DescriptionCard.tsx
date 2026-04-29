import { cn } from "@/lib/utils";
import { SPACING } from "../../1-ions/spacing";
import { TYPOGRAPHY } from "../../1-ions/typography";
import { Div } from "../../2-atoms/Div";
import { Heading } from "../../2-atoms/Heading";
import { Link } from "../../2-atoms/Link";
import { List, ListItem } from "../../2-atoms/List";
import { Span } from "../../2-atoms/Span";
import { Text } from "../../2-atoms/Text";
import { Card, CardContent } from "../../3-molecules/Card";
import type { DescriptionCardProps } from "./DescriptionCard.types";

/**
 * DescriptionCard
 *
 * A standalone organism that renders structured data as a card.
 * Automatically selects one of three layouts based on the item shape:
 *
 * - Step layout:     `item.step` is set — numbered process steps with code/tags/list support
 * - Icon layout:     `item.icon` set (no step) — centered icon + title + description
 * - Standard layout: no step, no icon — heading + content + description + subsections
 *
 * Used as the default renderer inside Grid.tsx, but can also be used standalone.
 *
 * Custom content escape hatches:
 * - `item.customContent` (alone): replaces default rendering, keeps Card wrapper
 * - `item.noWrapper + item.customContent`: raw render with no wrapper (consumer provides Card)
 * - `enforceCustomContent`: forces customContent into a responsive typography wrapper
 */
export const DescriptionCard = ({
	item,
	enforceCustomContent = false,
}: DescriptionCardProps) => {
	// Responsive wrapper className for enforceCustomContent mode
	// Normalises font sizes and icon sizes for externally-provided content
	const customContentWrapperClassName = enforceCustomContent
		? "flex flex-col gap-6 text-sm lg:text-base [&_p]:text-sm [&_p]:lg:text-base [&_span]:text-sm [&_span]:lg:text-base [&_th]:text-xs [&_th]:lg:text-sm [&_td]:text-xs [&_td]:lg:text-sm [&_button]:text-sm [&_button]:lg:text-base [&_a]:text-sm [&_a]:lg:text-base [&>div>div>svg]:h-6 [&>div>div>svg]:w-6"
		: undefined;

	// noWrapper mode: consumer is responsible for providing their own Card wrapper
	// Suppressed when enforceCustomContent is enabled (wrapper is always rendered then)
	if (item.noWrapper && item.customContent && !enforceCustomContent) {
		return <>{item.customContent}</>;
	}

	return (
		<Card aria-label={item.ariaLabel || item.title} fill>
			<CardContent centered={item.centered ?? !item.step}>
				{item.customContent ? (
					// Custom content — maintain h-full chain so mt-auto works in flex layouts
					<Div className={cn("h-full", customContentWrapperClassName)}>
						{item.customContent}
					</Div>
				) : (
					<>
						{/* ── Step-based layout ──────────────────────────────────────────────
						 * Used for "How It Works" style sections.
						 * Renders: STEP N label + icon + title inline, then description,
						 * code example, tags block, and items list below.
						 */}
						{item.step && (
							<>
								{/* Icon + "STEP N" label + title — all on one baseline */}
								<Div
									className={cn(
										// Layout — icon, label and title share one row
										"flex items-baseline",
										// Spacing
										SPACING.GAP.sm,
										"mb-3",
									)}
								>
									{item.icon && (
										<Div className={cn("shrink-0", item.color)}>
											{item.icon}
										</Div>
									)}
									<Span
										className={cn(
											// Typography
											TYPOGRAPHY.FONT_SIZE.xl,
											TYPOGRAPHY.FONT_WEIGHT.bold,
											// Color — matches icon color
											item.color,
										)}
									>
										STEP {item.step}
									</Span>
									<Heading as="h3" variant="card" className="mb-0">
										{item.title}
									</Heading>
								</Div>

								{/* Description text */}
								{item.description && (
									<Text variant="muted" className="mb-4">
										{item.description}
									</Text>
								)}

								{/* Code example block */}
								{item.codeExample && (
									<Div variant="codeBlock" className="mb-4">
										<Text
											variant="small"
											className={TYPOGRAPHY.FONT_FAMILY.mono}
										>
											{item.codeExample.code}
										</Text>
										{item.codeExample.note && (
											<Text
												variant="small"
												className="mt-1 text-muted-foreground"
											>
												{item.codeExample.note}
											</Text>
										)}
									</Div>
								)}

								{/* Tags block — displayed as "Supported AI Providers" */}
								{item.tags && (
									<Div variant="codeBlock" className="space-y-2">
										<Text
											variant="small"
											className={TYPOGRAPHY.FONT_WEIGHT.semibold}
										>
											Supported AI Providers:
										</Text>
										<Div
											className={cn(
												// Layout
												"flex flex-wrap",
												// Spacing
												SPACING.GAP.sm,
											)}
										>
											{item.tags.map((tag: string) => (
												<Span
													key={tag}
													className={cn(
														// Spacing
														SPACING.PADDING_X.sm,
														"py-1",
														// Visual
														"bg-background rounded",
														// Typography
														TYPOGRAPHY.FONT_SIZE.xs_sm,
													)}
												>
													{tag}
												</Span>
											))}
										</Div>
									</Div>
								)}

								{/* Items list — displayed as "Result Quality Metrics" */}
								{item.items && (
									<Div variant="codeBlock">
										<Text
											variant="small"
											className={cn(
												// Typography
												TYPOGRAPHY.FONT_WEIGHT.semibold,
												// Spacing
												"mb-2",
											)}
										>
											Result Quality Metrics:
										</Text>
										<List variant="spaced">
											{item.items.map((listItem: string) => (
												<ListItem key={listItem} variant="bullet">
													<Span className="text-primary">•</Span>
													<Text variant="small">{listItem}</Text>
												</ListItem>
											))}
										</List>
									</Div>
								)}
							</>
						)}

						{/* ── Icon-based layout ──────────────────────────────────────────────
						 * Used for feature highlights with a centered icon.
						 * Renders: centered icon + centered title + muted description.
						 */}
						{!item.step && item.icon && (
							<>
								<Div
									className={cn(
										// Layout — center icon horizontally
										"flex justify-center",
										// Spacing
										"mb-4",
										// Color — use primary for icons
										"text-primary",
									)}
								>
									{item.icon}
								</Div>
								<Heading variant="card" className="mb-3 text-center">
									{item.title}
								</Heading>
								{item.description && (
									<Text variant="muted" className="mb-4 text-center">
										{item.description}
									</Text>
								)}
							</>
						)}

						{/* ── Standard content layout ────────────────────────────────────────
						 * Default — used when neither step nor icon is present.
						 * Renders: subsection heading + content + description + subsections + list.
						 */}
						{!item.step && !item.icon && (
							<>
								<Heading variant="subsection" className="mb-3 lg:mb-4">
									{item.title}
								</Heading>

								{/* Content — supports both plain string and React node */}
								{item.content &&
									(typeof item.content === "string" ? (
										<Text variant="small" className="mb-3">
											{item.content}
										</Text>
									) : (
										<Div className="mb-3">{item.content}</Div>
									))}

								{item.description && (
									<Text variant="muted" className="mb-4">
										{item.description}
									</Text>
								)}

								{/* Subsections — each with its own subheading */}
								{item.subsections && (
									<Div className="space-y-3 lg:space-y-4">
										{item.subsections.map(
											(sub: { title: string; content: string }) => (
												<Div key={sub.title}>
													<Text variant="subheading" className="mb-2">
														{sub.title}
													</Text>
													<Text variant="small">{sub.content}</Text>
												</Div>
											),
										)}
									</Div>
								)}

								{/* Simple items list */}
								{item.items && (
									<List variant="spaced">
										{item.items.map((listItem: string) => (
											<ListItem key={listItem} variant="bullet">
												{listItem}
											</ListItem>
										))}
									</List>
								)}
							</>
						)}

						{/* ── Action / CTA ───────────────────────────────────────────────────
						 * Optional link rendered below all content.
						 * Supports both internal (router Link) and external (anchor) links.
						 */}
						{item.action && (
							<Text variant="small" className="text-center">
								{item.action.isInternal ? (
									<Link
										to={item.action.href}
										variant="primary"
										className="hover:underline"
									>
										{item.action.text}
									</Link>
								) : (
									<Link
										href={item.action.href}
										variant="primary"
										external
										className="hover:underline"
									>
										{item.action.text}
									</Link>
								)}
							</Text>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
};
