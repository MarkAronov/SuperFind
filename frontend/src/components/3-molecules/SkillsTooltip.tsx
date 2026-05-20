import { cn } from "@/lib/utils";
import { Glassmorphism as Glass } from "../1-ions/designs/Glassmorphism";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Badge } from "../2-atoms/Badge";
import { Div } from "../2-atoms/Div";
import { Tooltip, TooltipContent, TooltipTrigger } from "../2-atoms/Tooltip";
import type { SkillsTooltipProps } from "./SkillsTooltip.types";

/**
 * SkillsTooltip Component
 *
 * Displays skills list as badges in a glassmorphism tooltip.
 * Wraps any trigger element to show skills on hover.
 *
 * Visual Design:
 * - Glass card variant (frosted effect)
 * - Badge grid with flex-wrap (adapts to content)
 * - Secondary badge variant (subtle appearance)
 * - Max width: 384px (max-w-xs) prevents overly wide tooltips
 * - Subtle white border with shadow
 *
 * Trigger System:
 * - asChild: Wraps children element as trigger
 * - children: Any React element (button, text, icon, etc.)
 * - Hover to reveal skills list
 *
 * Spacing:
 * - Padding: 12px horizontal, 8px vertical (px-3 py-2)
 * - Gap: 6px between badges (gap-1.5)
 * - Badge size: Extra small text (text-xs)
 *
 * Delay:
 * - delayDuration: Customizable hover delay (default: 200ms)
 * - Prevents accidental tooltip triggers on quick mouse movements
 *
 * Use Cases:
 * - Person cards (show all skills on hover)
 * - Skill tags (expand abbreviated lists)
 * - Capability indicators
 * - Technology stacks
 */

export const SkillsTooltip = ({
	skills,
	children,
	className,
	delayDuration = 200,
}: SkillsTooltipProps) => {
	return (
		<Tooltip delayDuration={delayDuration}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent asChild>
				<Glass
					variant="card"
					className={cn(
						// Spacing
						"px-3 py-2",
						// Sizing
						"max-w-xs z-9999",
						// Borders & Effects
						"border border-white/20 dark:border-white/10",
						"shadow-lg shadow-black/10 dark:shadow-black/30",
						// Custom
						className,
					)}
				>
					{/* Skills badge container */}
					<Div
						className={cn(
							// Layout
							"flex flex-wrap",
							// Spacing
							SPACING.GAP.xs,
						)}
					>
						{skills.map((skill) => (
							<Badge
								key={skill}
								variant="secondary"
								className={TYPOGRAPHY.FONT_SIZE.xs}
							>
								{skill}
							</Badge>
						))}
					</Div>
				</Glass>
			</TooltipContent>
		</Tooltip>
	);
};
