import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { Button } from "../2-atoms/Button";
import { Div } from "../2-atoms/Div";
import type { PanelViewToggleProps } from "./PanelViewToggle.types";

/**
 * PanelViewToggle Molecule
 *
 * Toggle buttons for switching between different panel views
 * (e.g., Branches vs Releases). Shows active state and item counts.
 */
export const PanelViewToggle = ({
	options,
	activeValue,
	onChange,
	className,
}: PanelViewToggleProps) => {
	return (
		<Div
			className={cn("flex items-center flex-wrap", SPACING.GAP.sm, className)}
		>
			{options.map((option) => {
				const isActive = option.value === activeValue;
				const Icon = option.icon;

				return (
					<Button
						key={option.value}
						type="button"
						variant={isActive ? "default" : "ghost"}
						onClick={() => onChange(option.value)}
						className={cn("h-8 px-3", BORDERS.RADIUS.full)}
					>
						<Icon className={cn(SIZING.ICON.xs, "mr-1")} />
						{option.label} ({option.count})
					</Button>
				);
			})}
		</Div>
	);
};

export type { PanelViewToggleProps };
