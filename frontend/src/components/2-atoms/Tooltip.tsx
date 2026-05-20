import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Z_INDEX } from "../1-ions/zIndex";

/**
 * Tooltip Component
 *
 * Wraps shadcn/ui Tooltip with SkillVector customizations.
 * Provides contextual information on hover with optional variants.
 *
 * Variant system:
 * - default: Secondary background with subtle border (general UI hints)
 * - badge: Primary background with strong border (important status indicators)
 */

/**
 * Tooltip Provider
 * Manages tooltip timing and positioning context for all tooltips
 * Default delay: 0ms (instant)
 */
const TooltipProvider = ({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
	return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
};

/**
 * Tooltip Root
 * Wraps trigger and content, automatically provides TooltipProvider context
 */
const Tooltip = ({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	);
};

/**
 * Tooltip Trigger
 * Re-export of Radix trigger primitive
 * Wraps the element that displays tooltip on hover
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip Content
 * Displays tooltip message with optional arrow and variant styling
 *
 * Variant styling:
 * - default: Secondary background (bg-secondary, text-secondary-foreground)
 * - badge: Primary background (bg-primary, text-primary-foreground)
 *
 * Arrow system:
 * - Positioned with translate-y-[calc(-50%-2px)] for precise alignment
 * - Rotated 45deg to create diamond point
 * - Uses xs icon sizing (16px) with 2px rounded corners
 * - Matches content background and border colors
 */
const TooltipContent = ({
	className,
	sideOffset = 0,
	variant = "default",
	asChild = false,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
	variant?: "default" | "badge";
	asChild?: boolean;
}) => {
	// Choose component type based on asChild prop
	const Comp = asChild ? Slot : React.Fragment;

	// Build content with or without arrow based on asChild
	const content = asChild ? (
		<Comp>{children}</Comp>
	) : (
		<>
			{children}
			<TooltipPrimitive.Arrow
				className={cn(
					`${Z_INDEX.tooltip} ${SIZING.ICON.xs} translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]`,
					variant === "badge"
						? "bg-primary fill-primary border-primary"
						: "bg-secondary fill-secondary border-secondary",
				)}
			/>
		</>
	);

	// Build base classes for default variant styling
	const baseClasses = !asChild
		? `animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-fit origin-(--radix-tooltip-content-transform-origin) ${BORDERS.RADIUS.md} px-3 py-1.5 ${TYPOGRAPHY.FONT_SIZE.xs} text-balance border`
		: "";

	// Select variant colors
	const variantClasses =
		!asChild && variant === "badge"
			? "bg-primary text-primary-foreground border-primary"
			: !asChild
				? "bg-secondary text-secondary-foreground border-secondary"
				: "";

	// Combine all classes
	const combinedClassName = cn(
		"z-9999",
		baseClasses,
		variantClasses,
		className,
	);

	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={combinedClassName}
				{...props}
			>
				{content}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
