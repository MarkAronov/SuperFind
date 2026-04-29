import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Badge } from "../2-atoms/Badge";
import { Link } from "../2-atoms/Link";
import { Span } from "../2-atoms/Span";
import { Text } from "../2-atoms/Text";
import type { ContributorChipProps } from "./ContributorChip.types";

/**
 * ContributorChip Molecule
 *
 * Displays a contributor with avatar, username, and contribution count.
 * Pill-shaped chip with hover states and external link to GitHub profile.
 */
export const ContributorChip = ({
	login,
	avatarUrl,
	htmlUrl,
	contributions,
	className,
}: ContributorChipProps) => {
	return (
		<Link
			href={htmlUrl}
			external
			className={cn(
				"inline-flex max-w-full items-center",
				SPACING.GAP.xs,
				"pl-1 pr-3 py-1",
				BORDERS.RADIUS.full,
				"bg-muted/40 hover:bg-muted border border-border/50",
				"transition-colors group",
				className,
			)}
		>
			{/* Avatar */}
			<img
				src={avatarUrl}
				alt={login}
				className={cn(SIZING.ICON.lg, "rounded-full")}
			/>

			{/* Username */}
			<Span className="max-w-32 truncate sm:max-w-48">
				<Text
					variant="small"
					className={cn(
						TYPOGRAPHY.FONT_WEIGHT.medium,
						"group-hover:text-primary transition-colors",
					)}
				>
					{login}
				</Text>
			</Span>

			{/* Contribution count badge */}
			<Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
				{contributions}
			</Badge>
		</Link>
	);
};

export type { ContributorChipProps };
