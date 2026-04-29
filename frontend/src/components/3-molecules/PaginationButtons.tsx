import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import { Text } from "../2-atoms/Text";
import type { PaginationButtonsProps } from "./PaginationButtons.types";

/**
 * PaginationButtons Molecule
 *
 * Capsule-style pagination control with three connected sections:
 * - Left action button (previous page)
 * - Center page indicator text
 * - Right action button (next page)
 *
 * Design notes:
 * - Uses a single rounded-full (pill) shell so all sections fit as one unit
 * - Keeps content width compact, driven by icon sizes and page text
 * - Uses subtle separators to visually partition actions and status
 */
export const PaginationButtons = ({
	currentPage,
	totalPages,
	onPrevious,
	onNext,
	className,
}: PaginationButtonsProps) => {
	return (
		<Div
			className={cn(
				// Layout — one connected capsule with smooth rounded ends
				"inline-flex items-center overflow-hidden",
				// Shape
				BORDERS.RADIUS.full,
				// Shell styling
				"border border-border bg-card",
				className,
			)}
		>
			{/* Left segment — previous page action */}
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				onClick={onPrevious}
				disabled={currentPage === 1}
				className={cn(
					// Keep segment edges square so the outer capsule controls curvature
					"rounded-none border-0",
					// Keep interaction subtle inside the capsule
					"hover:bg-muted/60",
				)}
			>
				<ChevronLeft className={SIZING.ICON.sm} />
			</Button>

			{/* Center segment — current/total page indicator */}
			<Div
				className={cn(
					// Layout
					"flex items-center justify-center",
					// Spacing
					SPACING.PADDING_X.sm,
					// Subtle separators to define the middle segment
					"border-x border-border/70",
				)}
			>
				<Text
					variant="small"
					className="whitespace-nowrap text-muted-foreground"
				>
					{currentPage}/{totalPages}
				</Text>
			</Div>

			{/* Right segment — next page action */}
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				onClick={onNext}
				disabled={currentPage === totalPages}
				className={cn(
					// Keep segment edges square so the outer capsule controls curvature
					"rounded-none border-0",
					// Keep interaction subtle inside the capsule
					"hover:bg-muted/60",
				)}
			>
				<ChevronRight className={SIZING.ICON.sm} />
			</Button>
		</Div>
	);
};

export type { PaginationButtonsProps };
