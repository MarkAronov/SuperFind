import { GitCommit } from "lucide-react";
import { formatCompactDate, formatShortSha } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Div } from "../2-atoms/Div";
import { Link } from "../2-atoms/Link";
import { Span } from "../2-atoms/Span";
import { Text } from "../2-atoms/Text";
import type { CommitListItemProps } from "./CommitListItem.types";

/**
 * CommitListItem Molecule
 *
 * Displays a single git commit with author avatar, message, and metadata.
 * Card-like design with hover states for better scanability.
 */
export const CommitListItem = ({
	sha,
	message,
	authorLogin,
	authorName,
	authorAvatarUrl,
	commitDate,
	htmlUrl,
	className,
}: CommitListItemProps) => {
	// Extract first line of commit message
	const commitMessage = message.split("\n")[0];
	const shortSha = formatShortSha(sha);
	const formattedDate = formatCompactDate(commitDate);

	return (
		<Link
			href={htmlUrl}
			external
			className={cn(
				// Card-like commit rows improve scanability and visual hierarchy
				"flex w-full items-start min-w-0 border border-border/50 bg-muted/25",
				SPACING.GAP.sm,
				"p-2.5",
				BORDERS.RADIUS.lg,
				"hover:bg-muted/50 hover:border-primary/30 transition-colors group",
				className,
			)}
		>
			{/* Commit author avatar */}
			{authorAvatarUrl ? (
				<img
					src={authorAvatarUrl}
					alt={authorLogin || authorName}
					className={cn(SIZING.ICON.lg, "rounded-full shrink-0 mt-0.5")}
				/>
			) : (
				<Div
					className={cn(
						SIZING.ICON.lg,
						"rounded-full bg-muted shrink-0 mt-0.5 flex items-center justify-center",
					)}
				>
					<GitCommit className={cn(SIZING.ICON.xs, "text-muted-foreground")} />
				</Div>
			)}

			{/* Commit details */}
			<Div className="flex-1 min-w-0">
				{/* Commit message */}
				<Text
					variant="small"
					className={cn(
						"text-foreground block min-w-0 wrap-break-word sm:truncate",
						TYPOGRAPHY.FONT_WEIGHT.medium,
						"group-hover:text-primary transition-colors",
					)}
				>
					{commitMessage}
				</Text>

				{/* Commit metadata */}
				<Div
					className={cn(
						"flex flex-col sm:flex-row sm:items-center",
						SPACING.GAP.xs,
						"mt-0.5 min-w-0",
					)}
				>
					{/* Author */}
					<Text
						variant="small"
						className="text-muted-foreground min-w-0 wrap-break-word"
					>
						{authorLogin || authorName}
					</Text>

					<Span className="text-muted-foreground/40 hidden sm:inline">·</Span>

					{/* SHA */}
					<Text
						variant="small"
						className={cn(
							"text-muted-foreground font-mono shrink-0",
							TYPOGRAPHY.FONT_SIZE.xs,
						)}
					>
						{shortSha}
					</Text>

					<Span className="text-muted-foreground/40 hidden sm:inline">·</Span>

					{/* Date */}
					<Text variant="small" className="text-muted-foreground">
						{formattedDate}
					</Text>
				</Div>
			</Div>
		</Link>
	);
};

export type { CommitListItemProps };
