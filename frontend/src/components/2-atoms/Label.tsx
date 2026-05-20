import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentProps } from "react";

/**
 * Label Component
 *
 * Form label element for accessibility and usability.
 * Wraps Radix UI LabelPrimitive.Root directly (no shadcn intermediary).
 *
 * Features:
 * - Proper htmlFor association with inputs
 * - Disabled state styling (via group-data and peer selectors)
 * - Screen reader support
 *
 * Usage:
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 * ```
 */

const Label = ({
	className,
	...props
}: ComponentProps<typeof LabelPrimitive.Root>) => (
	<LabelPrimitive.Root
		data-slot="label"
		className={cn(
			// Layout — inline flex for optional icon/badge companions
			"flex items-center gap-2",
			// Typography — small, medium weight, no extra line height
			"text-sm leading-none font-medium select-none",
			// Disabled state — propagated from a parent group
			"group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
			// Peer disabled state — when paired with a disabled input
			"peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
			className,
		)}
		{...props}
	/>
);

export { Label };
export type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;
