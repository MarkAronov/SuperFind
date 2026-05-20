import { AnimatePresence, motion } from "framer-motion";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	ExternalLink,
	GitCommit,
	Github,
	Tag,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { MOTION } from "@/animations/0-tokens/tokens";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Badge } from "../2-atoms/Badge";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Link } from "../2-atoms/Link";
import { List, ListItem } from "../2-atoms/List";
import { Span } from "../2-atoms/Span";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "./Card";
import type { ReleaseCardProps } from "./ReleaseCard.types";

const parseMarkdownLinks = (
	text: string,
	idx: number,
): (string | React.ReactElement)[] => {
	const parts: (string | React.ReactElement)[] = [];
	let lastIndex = 0;

	// Combined regex to match markdown links, plain URLs, and @mentions
	const combinedRegex =
		/\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s]+)|@([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)/g;
	let match: RegExpExecArray | null = null;

	match = combinedRegex.exec(text);
	while (match !== null) {
		// Add text before the link
		if (match.index > lastIndex) {
			parts.push(text.substring(lastIndex, match.index));
		}

		// Check if it's a markdown link, plain URL, or @mention
		if (match[1] && match[2]) {
			// Markdown link [text](url)
			parts.push(
				<Link
					key={`link-${idx}-${match.index}`}
					href={match[2]}
					external
					variant="primary"
					className={cn(
						// Layout
						"inline-flex items-center",
						// Spacing
						"gap-1",
						// Typography
						TYPOGRAPHY.FONT_WEIGHT.medium,
					)}
				>
					{match[1]}
					<ExternalLink className={SIZING.ICON.xs} />
				</Link>,
			);
		} else if (match[3]) {
			// Plain URL
			const url = match[3];
			const displayUrl = url.length > 50 ? `${url.substring(0, 47)}...` : url;
			parts.push(
				<Link
					key={`link-${idx}-${match.index}`}
					href={url}
					external
					variant="primary"
					className={cn(
						// Layout
						"inline-flex items-center break-all",
						// Spacing
						"gap-1",
						// Typography
						TYPOGRAPHY.FONT_WEIGHT.medium,
					)}
				>
					{displayUrl}
					<ExternalLink className={SIZING.ICON.xs} />
				</Link>,
			);
		} else if (match[4]) {
			// @mention (GitHub username)
			const username = match[4];
			parts.push(
				<Link
					key={`mention-${idx}-${match.index}`}
					href={`https://github.com/${username}`}
					external
					variant="primary"
					className={cn(
						// Layout
						"inline-flex items-center",
						// Spacing
						"gap-1",
						// Typography
						TYPOGRAPHY.FONT_WEIGHT.medium,
					)}
				>
					@{username}
					<ExternalLink className={SIZING.ICON.xs} />
				</Link>,
			);
		}

		lastIndex = match.index + match[0].length;
		match = combinedRegex.exec(text);
	}

	// Add remaining text after last link
	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex));
	}

	// If no links found, just use the original text
	return parts.length > 0 ? parts : [text];
};

export const ReleaseCard: React.FC<ReleaseCardProps> = ({
	version,
	date,
	changes,
	url,
	isPrerelease,
	isLatest = false,
	compact = false,
}) => {
	// Number of changes to show when collapsed
	const MAX_CHANGES_COLLAPSED = 5;

	// State to track if card is expanded
	const [isExpanded, setIsExpanded] = useState(false);

	// Determine if we need a "Read More" button
	const needsReadMore = changes.length > MAX_CHANGES_COLLAPSED;

	// Compact mode renders a condensed card for dense panel contexts.
	if (compact) {
		// Max changes shown in collapsed compact state
		const MAX_COMPACT_COLLAPSED = 3;

		// Whether the compact card has more changes than the collapsed limit
		const needsCompactReadMore = changes.length > MAX_COMPACT_COLLAPSED;

		// Show limited or all changes depending on expanded state
		const compactChanges = isExpanded
			? changes
			: changes.slice(0, MAX_COMPACT_COLLAPSED);

		return (
			<Div
				className={cn(
					// Match CommitListItem card-like styling for visual consistency
					"flex w-full flex-col min-w-0 border border-border/50 bg-muted/25",
					SPACING.GAP.sm,
					"p-2.5",
					BORDERS.RADIUS.lg,
					"hover:bg-muted/50 hover:border-primary/30 transition-colors",
				)}
			>
				{/* Compact header: version, status, and quick external link */}
				<Div className="flex items-center justify-between gap-2">
					<Div className="flex items-center gap-1.5 min-w-0">
						<Text
							variant="small"
							className={cn(
								"truncate text-foreground",
								TYPOGRAPHY.FONT_WEIGHT.medium,
							)}
						>
							v{version}
						</Text>
						{isPrerelease && (
							<Badge
								variant="outline"
								className="text-[10px] h-4.5 px-1 text-amber-500 border-amber-500/20 bg-amber-500/10"
							>
								Pre
							</Badge>
						)}
						{isLatest && !isPrerelease && (
							<Badge
								variant="default"
								className="text-[10px] h-4.5 px-1 bg-green-500 text-white border-green-500"
							>
								Latest
							</Badge>
						)}
					</Div>

					{/* GitHub link icon — color inherits to SVG stroke; hover:text-accent matches footer GitHub icon behavior */}
					<Link
						href={url}
						external
						className="shrink-0 text-muted-foreground hover:text-accent transition-colors"
					>
						<Github className={SIZING.ICON.sm} />
					</Link>
				</Div>

				{/* Compact metadata row - matches commit metadata layout */}
				<Div
					className={cn(
						"flex flex-col sm:flex-row sm:items-center text-muted-foreground",
						SPACING.GAP.xs,
					)}
				>
					<Div className="flex items-center gap-1">
						<Calendar className={cn(SIZING.ICON.xs)} />
						<Text variant="small">
							{new Date(date).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</Text>
					</Div>
					<Span className="text-muted-foreground/40 hidden sm:inline">·</Span>
					<Text variant="small">
						{changes.length} {changes.length === 1 ? "change" : "changes"}
					</Text>
				</Div>

				{/* Compact change lines (max 3) - matches commit message style */}
				<Div className={cn("space-y-1", "mt-0.5")}>
					{compactChanges.map((change) => {
						const content = parseMarkdownLinks(change, changes.indexOf(change));
						const compactChangeKey = `${version}-${change}`;

						return (
							<Div key={compactChangeKey} className="flex items-start gap-1.5">
								<GitCommit
									className={cn(SIZING.ICON.xs, "text-primary shrink-0 mt-0.5")}
								/>
								<Text
									variant="small"
									className="text-muted-foreground leading-snug"
								>
									{content}
								</Text>
							</Div>
						);
					})}
				</Div>

				{/* See more / Show less toggle — only rendered when changes exceed the collapsed limit */}
				{needsCompactReadMore && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setIsExpanded(!isExpanded)}
						className={cn(
							// Layout — keep button sized to its content and center it
							"w-fit self-center justify-center",
							// Typography
							"text-primary hover:text-accent",
							// Spacing
							"px-0 mt-0.5",
						)}
					>
						{isExpanded ? (
							<>
								<ChevronUp className={cn(SIZING.ICON.xs, "mr-1")} />
								Show less
							</>
						) : (
							<>
								<ChevronDown className={cn(SIZING.ICON.xs, "mr-1")} />+
								{changes.length - MAX_COMPACT_COLLAPSED} more
							</>
						)}
					</Button>
				)}
			</Div>
		);
	}

	// Full-size card for the main product updates page.
	return (
		<Card variant="hover" fill>
			<CardContent className={cn("relative", compact ? "p-4" : undefined)}>
				{/* Header - Version and icon */}
				<Div
					className={cn(
						// Layout
						"flex items-start",
						// Spacing
						SPACING.GAP.md,
						compact ? "mb-3 pb-3" : "mb-6 pb-6",
					)}
				>
					{/* Content container */}
					<Div
						className={cn(
							// Layout
							"flex items-start flex-1",
							// Spacing
							SPACING.GAP.md,
						)}
					>
						{/* Icon */}
						<Div
							className={cn(
								// Spacing
								compact ? "p-2" : "p-3",
								// Effects
								"rounded-xl shrink-0",
								// Colors
								isPrerelease ? "bg-amber-500/10" : "bg-primary/10",
							)}
						>
							<Tag
								className={cn(
									// Sizing - matches commit card icon sizes
									SIZING.ICON.lg,
									// Colors
									isPrerelease ? "text-amber-500" : "text-primary",
								)}
							/>
						</Div>

						{/* Version Info */}
						<Div className="flex-1 min-w-0">
							{/* Version and badges */}
							<Div
								className={cn(
									// Layout
									"flex flex-wrap items-center",
									// Spacing
									SPACING.GAP.sm,
									compact ? "mb-1" : "mb-2",
								)}
							>
								<Heading as="h2" variant={compact ? "section" : "card"}>
									v{version}
								</Heading>
								{isPrerelease && (
									<Badge
										variant="outline"
										className={cn(
											// Colors
											"text-amber-500 border-amber-500/20 bg-amber-500/10",
										)}
									>
										Pre-release
									</Badge>
								)}
								{isLatest && !isPrerelease && (
									<Badge
										variant="default"
										className="bg-green-500 text-white border-green-500"
									>
										Latest
									</Badge>
								)}
							</Div>
							<Div
								className={cn(
									"flex items-center text-muted-foreground",
									compact ? "gap-1.5" : "gap-2",
								)}
							>
								<Calendar className={SIZING.ICON.sm} />
								<Text variant="small">
									{new Date(date).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</Text>
								<Span className="text-muted-foreground/50">•</Span>
								<Text variant="small">
									{changes.length} {changes.length === 1 ? "change" : "changes"}
								</Text>
							</Div>
						</Div>
					</Div>

					{/* GitHub Icon — color inherits to SVG stroke; hover:text-accent matches footer GitHub icon behavior */}
					<Link
						href={url}
						external
						className={cn(
							// Spacing
							compact ? "p-1.5" : "p-2",
							// Shape
							"rounded-lg",
							// Color — starts muted, accent on hover (same as footer social icons)
							"text-muted-foreground hover:text-accent",
							// States
							"transition-colors shrink-0",
						)}
					>
						<Github
							className={cn(
								// Sizing — consistent icon size
								SIZING.ICON.md,
								// Transition for smooth color change
								"transition-colors",
							)}
						/>
					</Link>
				</Div>

				{/* Changes List */}
				<Div className="relative">
					{/* Split changes: always-visible initial items + animated extra items */}
					{(() => {
						// First N changes are always in the DOM (no animation)
						const initialChanges = changes.slice(0, MAX_CHANGES_COLLAPSED);
						// Extra changes animate in/out with height + fade
						const extraChanges = changes.slice(MAX_CHANGES_COLLAPSED);

						const renderItem = (change: string) => {
							const content = parseMarkdownLinks(
								change,
								changes.indexOf(change),
							);
							return (
								<ListItem variant="bullet" key={`${version}-${change}`}>
									<GitCommit
										className={cn(
											"text-primary shrink-0 mt-0.5",
											SIZING.ICON.sm,
										)}
									/>
									<Text variant="muted" className="flex-1 leading-relaxed">
										{content}
									</Text>
								</ListItem>
							);
						};

						return (
							<>
								{/* Always-visible items */}
								<List variant="spaced">{initialChanges.map(renderItem)}</List>

								{/* Gradient overlay when collapsed and more items exist */}
								<AnimatePresence>
									{needsReadMore && !isExpanded && (
										<motion.div
											key="gradient"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={MOTION.transition.fast}
											className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center pb-2"
											style={{
												// Gradient from card background to transparent
												background:
													"linear-gradient(to top, hsl(var(--card)) 0%, hsl(var(--card) / 0.95) 25%, hsl(var(--card) / 0.8) 50%, hsl(var(--card) / 0.4) 75%, transparent 100%)",
											}}
										>
											<Button
												variant="secondary"
												size="sm"
												onClick={() => setIsExpanded(true)}
												className="shadow-sm"
											>
												<ChevronDown className={SIZING.ICON.sm} />
												Show {extraChanges.length} More
											</Button>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Extra items — spring height from 0 to auto on expand, spring back on collapse */}
								<AnimatePresence>
									{isExpanded && extraChanges.length > 0 && (
										<motion.div
											key="extra-changes"
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											// Spring on height for the bouncy end; fast opacity sync
											transition={MOTION.expand.transitionSpring}
											style={{ overflow: "hidden" }}
										>
											{/* Stagger container: each item cascades top-to-bottom as it appears */}
											<motion.div
												variants={MOTION.stagger.containerFast}
												initial="hidden"
												animate="visible"
												exit="hidden"
											>
												<List variant="spaced">
													{extraChanges.map((change) => (
														// Each item slides up from its stagger position
														<motion.div
															key={`extra-${version}-${change}`}
															variants={MOTION.stagger.item}
														>
															{renderItem(change)}
														</motion.div>
													))}
												</List>
											</motion.div>
										</motion.div>
									)}
								</AnimatePresence>
							</>
						);
					})()}
				</Div>

				{/* Show Less button animates in after expansion */}
				<AnimatePresence>
					{needsReadMore && isExpanded && (
						<motion.div
							key="show-less"
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 4 }}
							transition={MOTION.transition.fast}
							className="mt-4 flex justify-center"
						>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsExpanded(false)}
								className="text-primary"
							>
								<ChevronUp className={SIZING.ICON.sm} />
								Show Less
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
};
