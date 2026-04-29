import { GitBranch, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Badge } from "../2-atoms/Badge";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Link } from "../2-atoms/Link";
import { Span } from "../2-atoms/Span";
import type { BranchListItemProps } from "./BranchListItem.types";

/**
 * BranchListItem Molecule
 *
 * Displays a single git branch with selection, protection status, and external link.
 * Uses SearchBar-inspired pill design with selection highlighting.
 */
export const BranchListItem = ({
	branchName,
	isSelected,
	isDefault,
	isProtected,
	onSelect,
	githubUrl,
	className,
}: BranchListItemProps) => {
	return (
		<Div
			className={cn(
				// SearchBar-like pill container with stronger height and balanced spacing
				"flex w-full min-w-0 items-center overflow-hidden",
				"h-12",
				BORDERS.RADIUS.full,
				isSelected
					? "bg-primary/12 border border-primary/30"
					: "bg-muted/35 border border-border/50",
				// Add subtle depth similar to the search field treatment
				"shadow-sm",
				className,
			)}
		>
			{/* Selection action to load commits for this branch */}
			<Button
				type="button"
				variant="ghost"
				onClick={onSelect}
				className={cn(
					// Keep branch label area roomy and tappable
					"h-12 min-w-0 flex-1 justify-start rounded-none px-4 py-0",
					TYPOGRAPHY.FONT_SIZE.xs,
					TYPOGRAPHY.FONT_WEIGHT.medium,
					"hover:bg-transparent",
				)}
			>
				<GitBranch className={cn(SIZING.ICON.xs, "shrink-0 mr-2")} />
				<Span className="min-w-0 flex-1 break-all sm:break-normal">
					{branchName}
				</Span>
			</Button>

			{/* Divider mirrors SearchBar's input/action separator */}
			<Div className="h-8 w-px bg-border/70" />

			{/* Right-side controls grouped as compact action zone */}
			<Div className={cn("flex h-12 items-center px-3", SPACING.GAP.xs)}>
				{isDefault && (
					<Badge variant="outline" className="text-[10px] h-5 px-1.5">
						default
					</Badge>
				)}
				{isProtected && (
					<Shield className={cn(SIZING.ICON.xs, "text-success shrink-0")} />
				)}
				<Link
					href={githubUrl}
					external
					className={cn(
						TYPOGRAPHY.FONT_SIZE.xs,
						"rounded-md px-2 py-1 text-primary hover:bg-primary/10 no-underline",
					)}
				>
					Open
				</Link>
			</Div>
		</Div>
	);
};

export type { BranchListItemProps };
